-- P37H: admit the exact registered French first-party OAuth client without weakening P35 rollback.
-- Direct native Account sessions (client_id is null) remain supported while P35 is the rollback runtime.
-- Any OAuth client must resolve through Account's private first-party registry as app_slug='french'.

drop policy if exists french_sync_state_select_own on public.french_sync_state;
create policy french_sync_state_select_own
on public.french_sync_state
for select
to authenticated
using (
  (select auth.uid())=user_id
  and coalesce(((select auth.jwt())->>'is_anonymous')::boolean,false)=false
  and (
    ((select auth.jwt())->>'client_id') is null
    or public.is_thiepn_first_party_oauth_client_for_app('french')
  )
  and exists (
    select 1 from public.account_app_connections c
    where c.user_id=(select auth.uid())
      and c.app_slug='french'
      and c.status in ('connected','limited')
  )
  and exists (
    select 1 from public.account_app_grants g
    where g.user_id=(select auth.uid())
      and g.app_slug='french'
      and g.permission_id='app_data.read'
      and g.status='granted'
  )
);

create or replace function public.sync_thiepn_french_state(
  p_expected_revision bigint,
  p_state jsonb,
  p_app_version text default '',
  p_device_id text default null,
  p_client_updated_at timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path=''
as $function$
declare
  v_user_id uuid := (select auth.uid());
  v_row public.french_sync_state%rowtype;
begin
  if v_user_id is null then raise exception 'AUTH_REQUIRED' using errcode='28000'; end if;
  if coalesce(((select auth.jwt())->>'is_anonymous')::boolean,false) then
    raise exception 'ANONYMOUS_IDENTITY_NOT_SUPPORTED' using errcode='42501';
  end if;
  if (((select auth.jwt())->>'client_id')) is not null
     and not public.is_thiepn_first_party_oauth_client_for_app('french') then
    raise exception 'DELEGATED_OAUTH_RAW_DATA_DENIED' using errcode='42501';
  end if;
  if not exists (
    select 1 from public.account_app_connections c
    where c.user_id=v_user_id
      and c.app_slug='french'
      and c.status in ('connected','limited')
  ) then
    raise exception 'FRENCH_APP_NOT_CONNECTED' using errcode='42501';
  end if;
  if not exists (
    select 1 from public.account_app_grants g
    where g.user_id=v_user_id
      and g.app_slug='french'
      and g.permission_id='app_data.write'
      and g.status='granted'
  ) then
    raise exception 'FRENCH_WRITE_NOT_GRANTED' using errcode='42501';
  end if;
  if p_state is null or jsonb_typeof(p_state)<>'object' then
    raise exception 'INVALID_FRENCH_STATE' using errcode='22023';
  end if;
  if octet_length(p_state::text)>16777216 then
    raise exception 'FRENCH_STATE_TOO_LARGE' using errcode='22001';
  end if;
  if p_expected_revision is not null and p_expected_revision<1 then
    raise exception 'INVALID_EXPECTED_REVISION' using errcode='22023';
  end if;
  if p_client_updated_at is not null and p_client_updated_at>now()+interval '1 day' then
    raise exception 'INVALID_CLIENT_UPDATED_AT' using errcode='22023';
  end if;

  if p_expected_revision is null then
    insert into public.french_sync_state(user_id,revision,state,app_version,device_id,client_updated_at)
    values(v_user_id,1,p_state,left(coalesce(p_app_version,''),64),
      nullif(left(coalesce(p_device_id,''),160),''),p_client_updated_at)
    on conflict(user_id) do nothing
    returning * into v_row;
    if not found then raise exception 'FRENCH_SYNC_CONFLICT' using errcode='40001'; end if;
  else
    update public.french_sync_state
    set revision=revision+1,state=p_state,app_version=left(coalesce(p_app_version,''),64),
        device_id=nullif(left(coalesce(p_device_id,''),160),''),
        client_updated_at=p_client_updated_at,updated_at=now()
    where user_id=v_user_id and revision=p_expected_revision
    returning * into v_row;
    if not found then raise exception 'FRENCH_SYNC_CONFLICT' using errcode='40001'; end if;
  end if;

  return jsonb_build_object(
    'revision',v_row.revision,'state',v_row.state,'app_version',v_row.app_version,
    'device_id',v_row.device_id,'client_updated_at',v_row.client_updated_at,'updated_at',v_row.updated_at
  );
end;
$function$;

revoke all on function public.sync_thiepn_french_state(bigint,jsonb,text,text,timestamptz) from public,anon;
grant execute on function public.sync_thiepn_french_state(bigint,jsonb,text,text,timestamptz) to authenticated;
