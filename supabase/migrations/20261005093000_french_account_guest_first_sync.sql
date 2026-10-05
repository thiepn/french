-- French / THIEPN Account guest-first cloud sync.
-- Applied to the canonical THIEPN Account Supabase project.

insert into public.account_apps (slug, name, description, path, sort_order, active)
values ('french','French','Adaptive French learning with local-first study and optional private account sync.','/french/',60,true)
on conflict (slug) do update set
  name=excluded.name,
  description=excluded.description,
  path=excluded.path,
  sort_order=excluded.sort_order,
  active=excluded.active,
  updated_at=now();

insert into public.account_app_manifests
  (app_slug,manifest_version,identity_scope,data_scope,export_scope,capabilities,core_app_id)
values (
  'french',1,'shared','isolated','app-owned',
  jsonb_build_object(
    'account',true,'sync',true,'cloud_saves',true,'export_data',true,
    'isolatedData',true,'sharedIdentity',true,'activityTracking',true,'guestFirst',true
  ),
  'french'
)
on conflict (app_slug) do update set
  manifest_version=excluded.manifest_version,
  identity_scope=excluded.identity_scope,
  data_scope=excluded.data_scope,
  export_scope=excluded.export_scope,
  capabilities=excluded.capabilities,
  core_app_id=excluded.core_app_id,
  updated_at=now();

insert into public.account_app_permissions
  (app_slug,permission_id,name,description,required,mutable_by_user,sensitivity,sort_order,active)
values
  ('french','identity.basic','Basic account identity','Use your stable THIEPN Account ID to link French progress across devices.',true,false,'basic',10,true),
  ('french','app_data.read','Read French cloud progress','Read your own French learning snapshot from private cloud sync.',true,false,'basic',20,true),
  ('french','app_data.write','Update French cloud progress','Create and update your own French learning snapshot for cross-device sync.',true,false,'basic',30,true)
on conflict (app_slug,permission_id) do update set
  name=excluded.name,
  description=excluded.description,
  required=excluded.required,
  mutable_by_user=excluded.mutable_by_user,
  sensitivity=excluded.sensitivity,
  sort_order=excluded.sort_order,
  active=excluded.active,
  updated_at=now();

create table if not exists public.french_sync_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revision bigint not null default 1 check (revision>0),
  state jsonb not null
    check (jsonb_typeof(state)='object')
    check (octet_length(state::text)<=8388608),
  app_version text not null default '',
  device_id text,
  client_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.french_sync_state is
  'French app-owned full learning snapshots. Guest data stays local until the authenticated user explicitly enables sync.';

alter table public.french_sync_state enable row level security;

drop policy if exists "French users read own sync state" on public.french_sync_state;
create policy "French users read own sync state"
on public.french_sync_state
for select to authenticated
using ((select auth.uid())=user_id);

revoke all on table public.french_sync_state from anon;
revoke insert,update,delete on table public.french_sync_state from authenticated;
grant select on table public.french_sync_state to authenticated;

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
as $$
declare
  v_user_id uuid:=auth.uid();
  v_row public.french_sync_state%rowtype;
begin
  if v_user_id is null then raise exception 'AUTH_REQUIRED' using errcode='28000'; end if;
  if p_state is null or jsonb_typeof(p_state)<>'object' then
    raise exception 'INVALID_FRENCH_STATE' using errcode='22023';
  end if;
  if octet_length(p_state::text)>8388608 then
    raise exception 'FRENCH_STATE_TOO_LARGE' using errcode='22001';
  end if;

  if p_expected_revision is null then
    insert into public.french_sync_state
      (user_id,revision,state,app_version,device_id,client_updated_at)
    values
      (v_user_id,1,p_state,left(coalesce(p_app_version,''),64),
       nullif(left(coalesce(p_device_id,''),160),''),p_client_updated_at)
    on conflict (user_id) do nothing
    returning * into v_row;
    if not found then raise exception 'FRENCH_SYNC_CONFLICT' using errcode='40001'; end if;
  else
    update public.french_sync_state
    set revision=revision+1,
        state=p_state,
        app_version=left(coalesce(p_app_version,''),64),
        device_id=nullif(left(coalesce(p_device_id,''),160),''),
        client_updated_at=p_client_updated_at,
        updated_at=now()
    where user_id=v_user_id and revision=p_expected_revision
    returning * into v_row;
    if not found then raise exception 'FRENCH_SYNC_CONFLICT' using errcode='40001'; end if;
  end if;

  return jsonb_build_object(
    'revision',v_row.revision,'state',v_row.state,'app_version',v_row.app_version,
    'device_id',v_row.device_id,'client_updated_at',v_row.client_updated_at,'updated_at',v_row.updated_at
  );
end;
$$;

revoke all on function public.sync_thiepn_french_state(bigint,jsonb,text,text,timestamptz) from public;
revoke all on function public.sync_thiepn_french_state(bigint,jsonb,text,text,timestamptz) from anon;
grant execute on function public.sync_thiepn_french_state(bigint,jsonb,text,text,timestamptz) to authenticated;
