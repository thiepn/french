/** PINNED ORIGINAL P35 DATA, not re-authored placeholders.
 * Source: production main 022a815df744e740ad187554b800daffaec21701
 * index.html V580_SCENARIOS. Only the deterministic scenario data is
 * copied. No P35 imperative UI/storage/global state is executed.
 *
 * Important: B7 graph practice is source-authentic but the compact matcher
 * and evidence bridge are NOT independently certified P35 score parity.
 */
export interface P35Rule{
 need:string[][];next:string;gain:string[];func:string;sample:string;
 minWords?:number;skipIfSlot?:string;skipNext?:string;open?:boolean;
 [key:string]:unknown;
}
export interface P35Node{
 npc:string;end?:boolean;npcVariants?:string[];hint?:string;
 phrases?:string[];clarify?:string;rules?:P35Rule[];
}
export interface P35Graph{
 id:string;title:string;level:'A1'|'A2'|'B1'|'B2';duration:string;
 setting:string;goal:string;functions:string[];targets:string[];
 requiredGoals:string[];start:string;variantCount:number;
 slots?:Record<string,Record<string,string[]>>;
 nodes:Record<string,P35Node>;
}
function v580Rule(need:string[][],next:string,gain:string|string[],func:string,sample:string,extra:Record<string,unknown>={}):P35Rule{
 return {need,next,gain:Array.isArray(gain)?gain:gain?[gain]:[],func,sample,...extra};
}
export const P35_SOURCE_SCENARIOS:readonly P35Graph[]=Object.freeze(
[
      {
        id:'cafe-order',title:'Order at a café',level:'A1',duration:'quick',setting:'Café',goal:'Order a drink, specify a preference, and close politely.',
        functions:['request','specify','close'],targets:['café','thé','eau','petit','grand','merci'],requiredGoals:['order','detail','close'],start:'order',variantCount:3,
        slots:{
          drink:{'café':['café','cafe','espresso'],'thé':['thé','the'],'eau':['eau'],'jus':['jus']},
          size:{'petit':['petit','petite'],'grand':['grand','grande']}
        },
        nodes:{
          order:{npc:'Bonjour, qu’est-ce que vous prenez ?',npcVariants:['Bonjour, qu’est-ce que vous prenez ?','Bonjour ! Vous désirez quoi ?','Bonjour, je vous écoute.'],hint:'Greet the server and request a drink.',phrases:['Bonjour, je voudrais…','Un café, s’il vous plaît.','Je vais prendre…'],clarify:'Bien sûr. Dites-moi simplement ce que vous voulez boire.',rules:[
            v580Rule([['bonjour','salut'],['je voudrais','je veux','je vais prendre','j aimerais'],['café','cafe','thé','the','eau','jus']],'size','order','request','Bonjour, je voudrais un café, s’il vous plaît.',{minWords:3,skipIfSlot:'size',skipNext:'confirm'}),
            v580Rule([['je voudrais','je veux','je vais prendre','j aimerais'],['café','cafe','thé','the','eau','jus']],'size','order','request','Je voudrais un thé, s’il vous plaît.',{minWords:3,skipIfSlot:'size',skipNext:'confirm'})
          ]},
          size:{npc:'Très bien. Petit ou grand ?',npcVariants:['Très bien. Petit ou grand ?','D’accord. Vous le voulez petit ou grand ?','Parfait. Quelle taille ?'],hint:'Choose a size.',phrases:['Petit, s’il vous plaît.','Grand, merci.','Je le voudrais grand.'],rules:[
            v580Rule([['petit','petite','grand','grande']],'confirm','detail','specify','Petit, s’il vous plaît.',{minWords:1})
          ]},
          confirm:{npc:'Très bien. C’est tout ?',npcVariants:['Très bien. C’est tout ?','Parfait. Ce sera tout ?','D’accord. Autre chose ?'],hint:'Confirm that the order is complete.',phrases:['Oui, c’est tout.','Oui, merci.','C’est tout, merci.'],rules:[
            v580Rule([['oui','c est tout','cest tout','merci','non merci']],'end','close','close','Oui, c’est tout, merci.',{minWords:1})
          ]},
          end:{end:true,npc:'Parfait, merci. Bonne journée !',npcVariants:['Parfait, merci. Bonne journée !','Très bien, merci !','Voilà. Merci et bonne journée !']}
        }
      },
      {
        id:'bakery-buy',title:'Buy something at a bakery',level:'A1',duration:'quick',setting:'Boulangerie',goal:'Ask for an item, give a quantity, and close the purchase.',
        functions:['request','quantity','close'],targets:['pain','baguette','croissant','deux','trois','merci'],requiredGoals:['item','quantity','close'],start:'item',variantCount:3,
        slots:{
          item:{'baguette':['baguette'],'croissant':['croissant','croissants'],'pain':['pain']},
          quantity:{'un':['un','une'],'deux':['deux'],'trois':['trois']}
        },
        nodes:{
          item:{npc:'Bonjour, qu’est-ce qu’il vous faut ?',npcVariants:['Bonjour, qu’est-ce qu’il vous faut ?','Bonjour ! Vous voulez quoi ?','Je vous écoute.'],hint:'Request a bakery item.',phrases:['Je voudrais une baguette.','Je prends des croissants.','Un pain, s’il vous plaît.'],rules:[
            v580Rule([['je voudrais','je veux','je prends','il me faut'],['baguette','croissant','croissants','pain']],'quantity','item','request','Je voudrais une baguette, s’il vous plaît.',{minWords:2,skipIfSlot:'quantity',skipNext:'close'})
          ]},
          quantity:{npc:'Combien en voulez-vous ?',npcVariants:['Combien en voulez-vous ?','Vous en voulez combien ?','Quelle quantité ?'],hint:'Give a quantity.',phrases:['Deux, s’il vous plaît.','J’en voudrais trois.','Un seul, merci.'],rules:[
            v580Rule([['un','une','deux','trois','quatre']],'close','quantity','quantity','Deux, s’il vous plaît.',{minWords:1})
          ]},
          close:{npc:'Très bien. Ce sera tout ?',hint:'Close politely.',phrases:['Oui, merci.','C’est tout, merci.','Oui, c’est tout.'],rules:[
            v580Rule([['oui','c est tout','cest tout','merci']],'end','close','close','Oui, c’est tout, merci.',{minWords:1})
          ]},
          end:{end:true,npc:'Merci beaucoup. Au revoir !'}
        }
      },
      {
        id:'ask-directions',title:'Ask for directions',level:'A1',duration:'quick',setting:'Street',goal:'Ask where a place is, request one clarification, and confirm understanding.',
        functions:['ask-information','clarify','confirm','close'],targets:['gare','où','gauche','droite','loin','merci'],requiredGoals:['ask','confirm','close'],start:'ask',variantCount:3,
        nodes:{
          ask:{npc:'Bonjour, je peux vous aider ?',npcVariants:['Bonjour, je peux vous aider ?','Vous cherchez quelque chose ?','Bonjour. Vous avez besoin d’aide ?'],hint:'Ask where the station is.',phrases:['Où est la gare ?','Excusez-moi, je cherche la gare.','Comment aller à la gare ?'],rules:[
            v580Rule([['où est','ou est','je cherche','comment aller','pour aller'],['gare']],'confirm','ask','ask-information','Excusez-moi, où est la gare ?',{minWords:3})
          ],clarify:'La gare ? Oui. Continuez tout droit puis tournez à gauche.'},
          confirm:{npc:'Allez tout droit puis tournez à gauche. C’est clair ?',npcVariants:['Allez tout droit puis tournez à gauche. C’est clair ?','Continuez tout droit, puis à gauche. Vous avez compris ?','Tout droit, ensuite à gauche. Ça va ?'],hint:'Confirm or ask for one detail.',phrases:['Oui, j’ai compris.','À gauche après le feu ?','C’est loin ?'],rules:[
            v580Rule([['oui','j ai compris','jai compris','d accord','c est clair','cest clair']],'close','confirm','confirm','Oui, j’ai compris.',{minWords:1}),
            v580Rule([['c est loin','cest loin','combien de minutes','à gauche','a gauche','après','apres']],'close','confirm','clarify','C’est loin ?',{minWords:2})
          ],clarify:'Je répète : tout droit, puis à gauche après le feu.'},
          close:{npc:'C’est à environ cinq minutes. Autre chose ?',hint:'Thank the person and close.',phrases:['Non, merci beaucoup.','Merci pour votre aide.','C’est bon, merci.'],rules:[
            v580Rule([['merci','non merci','c est bon','cest bon']],'end','close','close','Merci beaucoup pour votre aide.',{minWords:1})
          ]},
          end:{end:true,npc:'Avec plaisir. Bonne journée !'}
        }
      },
      {
        id:'meet-classmate',title:'Meet a classmate',level:'A1',duration:'quick',setting:'Class',goal:'Introduce yourself with fictional details, exchange one fact, and close naturally.',
        functions:['introduce','give-information','close'],targets:['bonjour','je m’appelle','j’habite','étudier','langue','enchanté'],requiredGoals:['intro','fact','close'],start:'intro',variantCount:3,
        nodes:{
          intro:{npc:'Salut ! Moi, c’est Camille. Et toi ?',npcVariants:['Salut ! Moi, c’est Camille. Et toi ?','Bonjour, je m’appelle Camille. Tu t’appelles comment ?','Salut, je suis Camille. Et toi ?'],hint:'Give a fictional name and greet.',phrases:['Salut, je m’appelle Alex.','Bonjour, moi c’est Sam.','Je m’appelle Léa. Enchanté.'],rules:[
            v580Rule([['je m appelle','je mappelle','moi c est','moi cest','je suis']],'fact','intro','introduce','Salut, je m’appelle Alex.',{minWords:3})
          ]},
          fact:{npc:'Enchanté ! Tu étudies quoi ou tu travailles ?',hint:'Give one simple fictional fact.',phrases:['J’étudie les maths.','Je travaille dans un café.','J’étudie le français.'],rules:[
            v580Rule([['j étudie','jetudie','je travaille','je fais','j apprends','japprends']],'close','fact','give-information','J’étudie le français.',{minWords:3})
          ]},
          close:{npc:'Ah, intéressant ! On se voit en cours demain ?',hint:'Confirm and close naturally.',phrases:['Oui, à demain !','D’accord, à demain.','Oui, avec plaisir.'],rules:[
            v580Rule([['oui','d accord','a demain','à demain','avec plaisir']],'end','close','close','Oui, à demain !',{minWords:1})
          ]},
          end:{end:true,npc:'Super. À demain !'}
        }
      },
      {
        id:'opening-hours',title:'Ask about opening hours',level:'A1',duration:'quick',setting:'Shop',goal:'Ask when a place opens, confirm the information, and close politely.',
        functions:['ask-information','confirm','close'],targets:['ouvert','ouvrir','heure','demain','merci'],requiredGoals:['ask','confirm','close'],start:'ask',variantCount:3,
        nodes:{
          ask:{npc:'Bonjour, magasin Central.',npcVariants:['Bonjour, magasin Central.','Magasin Central, bonjour.','Bonjour, vous êtes bien au magasin Central.'],hint:'Ask what time the shop opens tomorrow.',phrases:['Vous ouvrez à quelle heure demain ?','À quelle heure est-ce que vous ouvrez ?','Le magasin ouvre quand demain ?'],rules:[
            v580Rule([['quelle heure','à quelle heure','a quelle heure','ouvre quand','ouvrez quand'],['ouvrez','ouvre','ouvert','magasin']],'confirm','ask','ask-information','Vous ouvrez à quelle heure demain ?',{minWords:4})
          ]},
          confirm:{npc:'Nous ouvrons à neuf heures. Ça vous convient ?',hint:'Confirm that the time works.',phrases:['Oui, parfait.','Oui, neuf heures, c’est bon.','D’accord, merci.'],rules:[
            v580Rule([['oui','parfait','d accord','c est bon','cest bon','ça va','ca va']],'close','confirm','confirm','Oui, parfait.',{minWords:1})
          ]},
          close:{npc:'Très bien. Vous avez une autre question ?',hint:'Close politely.',phrases:['Non, merci.','C’est tout, merci.','Non, bonne journée.'],rules:[
            v580Rule([['non','merci','c est tout','cest tout','bonne journée','bonne journee']],'end','close','close','Non, merci. Bonne journée.',{minWords:1})
          ]},
          end:{end:true,npc:'Merci, bonne journée !'}
        }
      },
      {
        id:'train-ticket',title:'Buy a train ticket',level:'A2',duration:'standard',setting:'Station',goal:'Request a ticket, specify trip details, ask the price, and confirm.',
        functions:['request','specify','give-information','confirm'],targets:['billet','aller','retour','train','demain','combien','euros'],requiredGoals:['ticket','trip','time','price','close'],start:'ticket',variantCount:3,
        slots:{
          trip:{'aller simple':['aller simple','simple'],'aller-retour':['aller retour','aller-retour','retour']},
          time:{'matin':['matin'],'après-midi':['après midi','apres midi'],'soir':['soir']}
        },
        nodes:{
          ticket:{npc:'Bonjour. Où souhaitez-vous aller ?',npcVariants:['Bonjour. Où souhaitez-vous aller ?','Bonjour, quelle destination ?','Je vous écoute. Vous allez où ?'],hint:'Request a ticket to a destination.',phrases:['Je voudrais un billet pour Lyon.','Un billet pour Paris, s’il vous plaît.','Je voudrais aller à Lille.'],rules:[
            v580Rule([['je voudrais','je veux','un billet','aller à','aller a'],['lyon','paris','lille','marseille','bordeaux','strasbourg']],'trip','ticket','request','Je voudrais un billet pour Lyon, s’il vous plaît.',{minWords:4})
          ]},
          trip:{npc:'Aller simple ou aller-retour ?',hint:'Specify one-way or return.',phrases:['Un aller simple.','Un aller-retour, s’il vous plaît.','Aller simple.'],rules:[
            v580Rule([['aller simple','simple','aller retour','aller-retour','retour']],'time','trip','specify','Un aller-retour, s’il vous plaît.',{minWords:1})
          ]},
          time:{npc:'Vous voulez partir quand ?',hint:'Give a day or time.',phrases:['Demain matin.','Cet après-midi vers quinze heures.','Demain vers dix heures.'],rules:[
            v580Rule([['demain','aujourd hui','aujourdhui','matin','après midi','apres midi','soir','heures']],'price','time','give-information','Demain matin, vers dix heures.',{minWords:2})
          ]},
          price:{npc:'J’ai un train à 10 h 12. Le billet coûte 32 euros.',hint:'Ask or confirm the price.',phrases:['C’est bien 32 euros ?','D’accord, 32 euros.','Ça fait combien exactement ?'],rules:[
            v580Rule([['32','trente deux','combien','euros','c est bien','cest bien','d accord']],'close','price','confirm','D’accord, 32 euros.',{minWords:2})
          ]},
          close:{npc:'Vous le prenez ?',hint:'Confirm the purchase and close.',phrases:['Oui, je le prends.','Oui, merci.','D’accord, je prends ce billet.'],rules:[
            v580Rule([['oui','je le prends','je prends','d accord']],'end','close','confirm','Oui, je le prends. Merci.',{minWords:1})
          ]},
          end:{end:true,npc:'Très bien. Bon voyage !'}
        }
      },
      {
        id:'hotel-problem',title:'Solve a hotel problem',level:'A2',duration:'standard',setting:'Hotel',goal:'Explain a room problem, clarify it, request a solution, and accept or reject an option.',
        functions:['explain','give-information','request','accept','close'],targets:['chambre','problème','wifi','chauffage','douche','changer','réparer'],requiredGoals:['problem','clarify','solution','decision','close'],start:'problem',variantCount:3,
        nodes:{
          problem:{npc:'Bonsoir. Tout se passe bien dans votre chambre ?',npcVariants:['Bonsoir. Tout se passe bien dans votre chambre ?','Bonsoir. Votre chambre vous convient ?','Bonsoir. Est-ce que tout va bien ?'],hint:'Explain one concrete room problem.',phrases:['Non, j’ai un problème avec le wifi.','Le chauffage ne marche pas.','La douche ne fonctionne pas.'],rules:[
            v580Rule([['problème','probleme','ne marche pas','ne fonctionne pas'],['wifi','chauffage','douche','clé','cle','chambre']],'clarify','problem','explain','J’ai un problème : le wifi ne marche pas.',{minWords:4})
          ]},
          clarify:{npc:'D’accord. Le problème a commencé quand ?',hint:'Give a short clarification about when or how.',phrases:['Depuis ce soir.','Depuis mon arrivée.','Ça ne marche pas depuis une heure.'],rules:[
            v580Rule([['depuis','ce soir','mon arrivée','mon arrivee','une heure','aujourd hui','aujourdhui']],'solution','clarify','give-information','Ça ne marche pas depuis ce soir.',{minWords:2})
          ],clarify:'Je vous demande depuis quand le problème existe.'},
          solution:{npc:'Je peux envoyer quelqu’un dans vingt minutes, ou vous proposer une autre chambre.',hint:'Request the solution you prefer.',phrases:['Pouvez-vous envoyer quelqu’un ?','Je préfère changer de chambre.','Je voudrais une autre chambre.'],rules:[
            v580Rule([['pouvez vous','je voudrais','je préfère','je prefere','est ce possible'],['envoyer','quelqu un','quelquun','autre chambre','changer de chambre']],'decision','solution','request','Je préfère changer de chambre, s’il vous plaît.',{minWords:3})
          ]},
          decision:{npc:'Très bien. Une chambre au quatrième étage est libre. Ça vous convient ?',hint:'Accept or reject with a brief reason.',phrases:['Oui, ça me convient.','Oui, c’est parfait.','Non, je préfère rester à cet étage.'],rules:[
            v580Rule([['oui','ça me convient','ca me convient','parfait','d accord','non','je préfère','je prefere']],'close','decision','accept','Oui, ça me convient.',{minWords:1})
          ]},
          close:{npc:'Très bien. Je prépare la solution tout de suite.',hint:'Thank the receptionist and close.',phrases:['Merci beaucoup.','Parfait, merci pour votre aide.','Merci, bonne soirée.'],rules:[
            v580Rule([['merci','bonne soirée','bonne soiree','parfait']],'end','close','close','Merci beaucoup pour votre aide.',{minWords:1})
          ]},
          end:{end:true,npc:'Avec plaisir. Bonne soirée !'}
        }
      },
      {
        id:'restaurant-fix',title:'Correct a restaurant order',level:'A2',duration:'standard',setting:'Restaurant',goal:'Point out a mistake, clarify the intended order, request a correction, and close politely.',
        functions:['correct','give-information','request','accept','close'],targets:['commande','plat','salade','poisson','désolé','changer','merci'],requiredGoals:['mistake','clarify','request','confirm','close'],start:'mistake',variantCount:3,
        nodes:{
          mistake:{npc:'Voilà votre plat. Bon appétit !',npcVariants:['Voilà votre plat. Bon appétit !','Et voilà pour vous.','Voici votre commande.'],hint:'Politely say that this is not what you ordered.',phrases:['Excusez-moi, ce n’est pas ma commande.','Désolé, je n’ai pas commandé ça.','Je crois qu’il y a une erreur.'],rules:[
            v580Rule([['ce n est pas','ce nest pas','pas ma commande','pas commandé','pas commande','une erreur','il y a une erreur']],'clarify','mistake','correct','Excusez-moi, ce n’est pas ma commande.',{minWords:4})
          ]},
          clarify:{npc:'Oh, désolé. Qu’est-ce que vous aviez commandé ?',hint:'State the intended dish.',phrases:['J’avais commandé le poisson.','J’ai demandé une salade.','Je voulais le plat végétarien.'],rules:[
            v580Rule([['j avais commandé','j avais commande','j ai demandé','j ai demande','je voulais','j avais pris'],['poisson','salade','plat','menu']],'request','clarify','give-information','J’avais commandé le poisson.',{minWords:4})
          ]},
          request:{npc:'Je comprends. Que voulez-vous que je fasse ?',hint:'Request the correction.',phrases:['Pouvez-vous changer le plat ?','Je voudrais la bonne commande.','Pouvez-vous m’apporter le poisson ?'],rules:[
            v580Rule([['pouvez vous','je voudrais','est ce que vous pouvez'],['changer','apporter','bonne commande','remplacer']],'confirm','request','request','Pouvez-vous changer le plat, s’il vous plaît ?',{minWords:4})
          ]},
          confirm:{npc:'Bien sûr. Cela prendra environ dix minutes. Ça va ?',hint:'Accept or negotiate.',phrases:['Oui, pas de problème.','Oui, ça va.','D’accord, merci.'],rules:[
            v580Rule([['oui','ça va','ca va','pas de problème','pas de probleme','d accord']],'close','confirm','accept','Oui, pas de problème.',{minWords:1})
          ]},
          close:{npc:'Très bien, je reviens avec votre plat.',hint:'Close politely.',phrases:['Merci beaucoup.','Merci pour votre aide.','D’accord, merci.'],rules:[
            v580Rule([['merci','d accord']],'end','close','close','Merci beaucoup.',{minWords:1})
          ]},
          end:{end:true,npc:'Avec plaisir. Désolé encore pour l’erreur.'}
        }
      },
      {
        id:'weekend-plan',title:'Make a weekend plan',level:'A2',duration:'standard',setting:'Friends',goal:'Suggest an activity, negotiate time, disagree or offer an alternative, and confirm the plan.',
        functions:['suggest','preference','alternative','confirm'],targets:['samedi','dimanche','cinéma','parc','préférer','plutôt','heure'],requiredGoals:['suggest','time','alternative','confirm'],start:'suggest',variantCount:3,
        nodes:{
          suggest:{npc:'On fait quelque chose ce week-end ?',npcVariants:['On fait quelque chose ce week-end ?','Tu as envie de sortir ce week-end ?','On organise quelque chose samedi ou dimanche ?'],hint:'Suggest an activity.',phrases:['On pourrait aller au cinéma.','Je propose d’aller au parc.','Pourquoi pas un café ?'],rules:[
            v580Rule([['on pourrait','je propose','pourquoi pas','on peut','j aimerais'],['cinéma','cinema','parc','café','cafe','musée','musee','restaurant']],'time','suggest','suggest','On pourrait aller au cinéma.',{minWords:3})
          ]},
          time:{npc:'Bonne idée. Samedi à quatorze heures ?',hint:'Accept the time or propose another one.',phrases:['Quatorze heures, c’est bien.','Je préfère vers seize heures.','Samedi, oui, mais plutôt à quinze heures.'],rules:[
            v580Rule([['quatorze','14','quinze','15','seize','16','heure','heures','je préfère','je prefere','plutôt','plutot','c est bien','cest bien']],'alternative','time','preference','Je préfère plutôt vers seize heures.',{minWords:2})
          ]},
          alternative:{npc:'D’accord. Et si le cinéma est complet, on fait quoi ?',hint:'Give an alternative plan.',phrases:['On peut aller au parc.','Alors, on prend un café.','On pourrait aller au musée à la place.'],rules:[
            v580Rule([['on peut','on pourrait','alors','à la place','a la place'],['parc','café','cafe','musée','musee','restaurant','promenade']],'confirm','alternative','alternative','On peut aller au parc à la place.',{minWords:3})
          ]},
          confirm:{npc:'Parfait. Donc samedi à seize heures, avec le parc comme plan B ?',hint:'Confirm the final plan.',phrases:['Oui, parfait.','D’accord, c’est décidé.','Oui, ça marche.'],rules:[
            v580Rule([['oui','parfait','d accord','c est décidé','cest decide','ça marche','ca marche']],'end','confirm','confirm','Oui, parfait. Ça marche.',{minWords:1})
          ]},
          end:{end:true,npc:'Super, à samedi !'}
        }
      },
      {
        id:'return-item',title:'Return an item to a shop',level:'A2',duration:'standard',setting:'Shop',goal:'Explain a return, give a reason, request refund or exchange, and confirm the solution.',
        functions:['request','give-reason','preference','confirm','close'],targets:['retourner','article','taille','rembourser','échanger','ticket','merci'],requiredGoals:['return','reason','solution','confirm','close'],start:'return',variantCount:3,
        nodes:{
          return:{npc:'Bonjour. Je peux vous aider ?',hint:'Say that you want to return an item.',phrases:['Bonjour, je voudrais retourner cet article.','Je veux rendre ce pull.','Je voudrais faire un retour.'],rules:[
            v580Rule([['je voudrais','je veux','j aimerais'],['retourner','rendre','faire un retour']],'reason','return','request','Je voudrais retourner cet article.',{minWords:3})
          ]},
          reason:{npc:'Bien sûr. Quel est le problème ?',hint:'Give the reason.',phrases:['La taille est trop petite.','Il ne me va pas.','L’article est abîmé.'],rules:[
            v580Rule([['trop petit','trop petite','trop grand','trop grande','ne me va pas','abîmé','abime','cassé','casse','problème','probleme']],'solution','reason','give-reason','La taille est trop petite.',{minWords:3})
          ]},
          solution:{npc:'Vous préférez un échange ou un remboursement ?',hint:'Choose and request one solution.',phrases:['Je préfère un remboursement.','Je voudrais l’échanger.','Un remboursement, s’il vous plaît.'],rules:[
            v580Rule([['remboursement','rembourser','échanger','echanger','échange','echange']],'confirm','solution','preference','Je préfère un remboursement.',{minWords:2})
          ]},
          confirm:{npc:'D’accord. Vous avez le ticket ?',hint:'Confirm whether you have the receipt.',phrases:['Oui, le voici.','Oui, j’ai le ticket.','Non, je ne l’ai plus.'],rules:[
            v580Rule([['oui','le voici','j ai le ticket','jai le ticket','non','je ne l ai plus','je ne lai plus']],'close','confirm','confirm','Oui, le voici.',{minWords:1})
          ]},
          close:{npc:'Très bien, je m’en occupe.',hint:'Thank the employee and close.',phrases:['Merci beaucoup.','Parfait, merci.','Merci pour votre aide.'],rules:[
            v580Rule([['merci','parfait']],'end','close','close','Merci beaucoup.',{minWords:1})
          ]},
          end:{end:true,npc:'Voilà, c’est fait. Bonne journée !'}
        }
      },
      {
        id:'travel-delay',title:'Handle a travel delay',level:'B1',duration:'challenge',setting:'Station service desk',goal:'Explain the delay problem, ask about options, compare alternatives, choose one, and justify your choice.',
        functions:['explain','ask-information','compare','preference','justify','confirm'],targets:['retard','correspondance','changer','train','solution','préférer','parce que'],requiredGoals:['problem','options','compare','choice','reason','close'],start:'problem',variantCount:3,
        nodes:{
          problem:{npc:'Bonjour. Que puis-je faire pour vous ?',hint:'Explain that a delay caused you to miss a connection.',phrases:['Mon train a eu du retard et j’ai raté ma correspondance.','À cause du retard, j’ai manqué le train suivant.'],rules:[
            v580Rule([['retard','en retard'],['correspondance','raté','rate','manqué','manque']],'options','problem','explain','Mon train a eu du retard et j’ai raté ma correspondance.',{minWords:7})
          ]},
          options:{npc:'Je comprends. Il y a un train dans une heure, ou un bus dans trente minutes.',hint:'Ask for useful information about the alternatives.',phrases:['Combien de temps dure le trajet en bus ?','Est-ce que le bus est direct ?','Le prochain train arrive à quelle heure ?'],rules:[
            v580Rule([['combien','est ce que','quelle heure','à quelle heure','a quelle heure'],['bus','train','trajet','direct','arrive']],'compare','options','ask-information','Combien de temps dure le trajet en bus ?',{minWords:5})
          ]},
          compare:{npc:'Le bus est direct mais plus lent. Le train est plus confortable, mais part plus tard.',hint:'Compare the two choices or state a preference.',phrases:['Le bus part plus tôt, mais le train est plus confortable.','Je préfère le bus parce qu’il part plus tôt.'],rules:[
            v580Rule([['bus','train'],['plus','mais','préférer','prefere','je préfère','je prefere']],'choice','compare','compare','Le bus part plus tôt, mais le train est plus confortable.',{minWords:6})
          ]},
          choice:{npc:'Quelle option choisissez-vous finalement ?',hint:'Choose one option clearly.',phrases:['Je vais prendre le bus.','Je choisis le train.','Je préfère attendre le train.'],rules:[
            v580Rule([['je vais prendre','je choisis','je préfère','je prefere'],['bus','train']],'reason','choice','preference','Je vais prendre le bus.',{minWords:4})
          ]},
          reason:{npc:'D’accord. Pourquoi cette option ?',hint:'Give a short reason.',phrases:['Parce que je dois arriver avant dix-huit heures.','Comme je suis pressé, le bus est plus pratique.'],rules:[
            v580Rule([['parce que','comme','car','puisque']],'close','reason','justify','Parce que je dois arriver avant dix-huit heures.',{minWords:6})
          ]},
          close:{npc:'Très bien. Je peux modifier votre billet maintenant.',hint:'Confirm and close.',phrases:['Oui, faites-le, s’il vous plaît. Merci.','Oui, je confirme. Merci pour votre aide.'],rules:[
            v580Rule([['oui','je confirme','faites le','merci']],'end','close','confirm','Oui, je confirme. Merci pour votre aide.',{minWords:2})
          ]},
          end:{end:true,npc:'C’est fait. Bon voyage malgré le retard !'}
        }
      },
      {
        id:'apartment-repair',title:'Arrange an apartment repair',level:'B1',duration:'challenge',setting:'Phone call',goal:'Describe a household problem, explain urgency, negotiate an appointment, clarify access, and confirm.',
        functions:['describe','explain','negotiate','clarify','confirm','close'],targets:['appartement','fuite','chauffage','réparer','rendez-vous','disponible','urgent'],requiredGoals:['problem','urgency','appointment','access','confirm','close'],start:'problem',variantCount:3,
        nodes:{
          problem:{npc:'Service de réparation, bonjour. Quel est le problème ?',hint:'Describe a concrete problem in the apartment.',phrases:['J’ai une fuite sous l’évier dans mon appartement.','Le chauffage ne fonctionne plus depuis hier.'],rules:[
            v580Rule([['fuite','chauffage','eau','évier','evier','ne fonctionne plus','cassé','casse']],'urgency','problem','describe','J’ai une fuite sous l’évier dans mon appartement.',{minWords:6})
          ]},
          urgency:{npc:'Depuis quand avez-vous ce problème ? Est-ce urgent ?',hint:'Explain when it started and why it is or is not urgent.',phrases:['Depuis hier soir, et c’est assez urgent parce que l’eau coule encore.','Depuis deux jours, mais ce n’est pas dangereux.'],rules:[
            v580Rule([['depuis'],['urgent','pas urgent','dangereux','eau','encore','problème','probleme']],'appointment','urgency','explain','Depuis hier soir, et c’est urgent parce que l’eau coule encore.',{minWords:6})
          ]},
          appointment:{npc:'Je peux envoyer quelqu’un demain entre huit et dix heures. Êtes-vous disponible ?',hint:'Accept or negotiate another time.',phrases:['Demain matin me convient.','Je ne suis pas disponible à huit heures ; est-ce possible après dix heures ?'],rules:[
            v580Rule([['demain','heure','heures','disponible','me convient','possible','après','apres']],'access','appointment','negotiate','Je ne suis pas disponible à huit heures. Est-ce possible après dix heures ?',{minWords:5})
          ]},
          access:{npc:'D’accord. Le technicien peut-il entrer si vous n’êtes pas là ?',hint:'Clarify how access should work.',phrases:['Non, je préfère être présent.','Oui, le gardien peut ouvrir.','Je laisserai la clé au voisin.'],rules:[
            v580Rule([['je préfère','je prefere','gardien','clé','cle','voisin','présent','present','oui','non']],'confirm','access','clarify','Je préfère être présent, donc venez après dix heures.',{minWords:4})
          ]},
          confirm:{npc:'Très bien : demain à dix heures trente, et vous serez présent. Je confirme ?',hint:'Confirm or correct one detail.',phrases:['Oui, c’est exact.','Oui, je confirme.','Presque : plutôt onze heures, s’il vous plaît.'],rules:[
            v580Rule([['oui','je confirme','c est exact','cest exact','presque','plutôt','plutot']],'close','confirm','confirm','Oui, c’est exact. Je confirme.',{minWords:2})
          ]},
          close:{npc:'Parfait. Avez-vous besoin d’autre chose ?',hint:'Close the call politely.',phrases:['Non, merci pour votre aide.','C’est tout, merci. Bonne journée.'],rules:[
            v580Rule([['non','merci','c est tout','cest tout','bonne journée','bonne journee']],'end','close','close','Non, merci pour votre aide. Bonne journée.',{minWords:2})
          ]},
          end:{end:true,npc:'Très bien. À demain.'}
        }
      },
      {
        id:'recommend-disagree',title:'Recommend and disagree politely',level:'B1',duration:'challenge',setting:'Conversation with a friend',goal:'Make a recommendation, respond to disagreement, propose an alternative, justify it, and reach agreement.',
        functions:['recommend','disagree','alternative','justify','agree','close'],targets:['recommander','à mon avis','pourtant','plutôt','parce que','d’accord'],requiredGoals:['recommend','disagree','alternative','reason','agree','close'],start:'recommend',variantCount:3,
        nodes:{
          recommend:{npc:'Je cherche un endroit sympa à visiter ce week-end. Tu me conseilles quoi ?',hint:'Recommend a place or activity.',phrases:['Je te conseille le musée d’art moderne.','À mon avis, le vieux quartier vaut le détour.'],rules:[
            v580Rule([['je te conseille','je recommande','à mon avis','a mon avis','tu devrais']],'disagree','recommend','recommend','À mon avis, tu devrais visiter le vieux quartier.',{minWords:5})
          ]},
          disagree:{npc:'Je ne suis pas très convaincu : j’ai peur qu’il y ait trop de monde.',hint:'Acknowledge the concern and disagree politely or qualify your recommendation.',phrases:['Je comprends, mais le matin c’est assez calme.','C’est vrai, pourtant ça vaut la peine si tu y vas tôt.'],rules:[
            v580Rule([['je comprends','c est vrai','cest vrai','tu as raison','pourtant','mais']],'alternative','disagree','disagree','Je comprends, mais le matin c’est assez calme.',{minWords:5})
          ]},
          alternative:{npc:'Tu aurais une autre idée alors ?',hint:'Offer an alternative.',phrases:['On pourrait plutôt aller au parc au bord du fleuve.','Sinon, je te conseille le marché couvert.'],rules:[
            v580Rule([['on pourrait','plutôt','plutot','sinon','une autre idée','une autre idee','je te conseille']],'reason','alternative','alternative','Sinon, on pourrait plutôt aller au parc.',{minWords:5})
          ]},
          reason:{npc:'Pourquoi cette option serait meilleure ?',hint:'Give a reason or comparison.',phrases:['Parce que c’est plus calme et qu’on peut y rester longtemps.','Comme il fait beau, le parc sera plus agréable.'],rules:[
            v580Rule([['parce que','comme','car','puisque']],'agree','reason','justify','Parce que c’est plus calme et qu’on peut y rester longtemps.',{minWords:7})
          ]},
          agree:{npc:'D’accord, ça me paraît mieux. On fait comme ça ?',hint:'Reach agreement.',phrases:['Oui, d’accord.','Oui, ça me va.','Parfait, faisons comme ça.'],rules:[
            v580Rule([['oui','d accord','ça me va','ca me va','parfait','comme ça','comme ca']],'close','agree','agree','Oui, d’accord. Faisons comme ça.',{minWords:2})
          ]},
          close:{npc:'Super. On se retrouve samedi matin alors.',hint:'Close naturally.',phrases:['Parfait, à samedi.','Très bien, à samedi matin.'],rules:[
            v580Rule([['parfait','très bien','tres bien','à samedi','a samedi']],'end','close','close','Parfait, à samedi !',{minWords:2})
          ]},
          end:{end:true,npc:'À samedi !'}
        }
      },
      {
        id:'past-event',title:'Tell what happened',level:'B1',duration:'challenge',setting:'Customer service',goal:'Narrate a past problem in sequence, give relevant detail, explain the consequence, request action, and confirm.',
        functions:['narrate','sequence','explain','request','confirm','close'],targets:['hier','d’abord','ensuite','finalement','problème','parce que','solution'],requiredGoals:['event','sequence','consequence','request','confirm','close'],start:'event',variantCount:3,
        nodes:{
          event:{npc:'Bonjour. Pouvez-vous m’expliquer ce qui s’est passé ?',hint:'Start a short past-event account.',phrases:['Hier, j’ai essayé de récupérer mon colis, mais le point relais était fermé.','Ce matin, je suis venu chercher ma réservation, mais elle n’était pas enregistrée.'],rules:[
            v580Rule([['hier','ce matin','la semaine dernière','la semaine derniere','j ai','je suis','était','etait'],['mais','problème','probleme','fermé','ferme','pas']],'sequence','event','narrate','Hier, j’ai essayé de récupérer mon colis, mais le point relais était fermé.',{minWords:8})
          ]},
          sequence:{npc:'Et ensuite, qu’avez-vous fait ?',hint:'Continue with a sequence marker.',phrases:['Ensuite, j’ai appelé le service client.','Après ça, je suis revenu une heure plus tard.'],rules:[
            v580Rule([['ensuite','après','apres','puis','alors','finalement']],'consequence','sequence','sequence','Ensuite, j’ai appelé le service client.',{minWords:6})
          ]},
          consequence:{npc:'Quelle conséquence cela a eu pour vous ?',hint:'Explain the consequence or why it matters.',phrases:['J’ai perdu beaucoup de temps parce que je devais repartir travailler.','À cause de ça, je n’ai pas pu récupérer le colis.'],rules:[
            v580Rule([['parce que','à cause','a cause','donc','du coup','je n ai pas','je nai pas']],'request','consequence','explain','À cause de ça, je n’ai pas pu récupérer le colis.',{minWords:7})
          ]},
          request:{npc:'Je comprends. Qu’attendez-vous de nous maintenant ?',hint:'Request a concrete solution.',phrases:['Je voudrais que vous reprogrammiez la livraison.','Pouvez-vous me proposer une nouvelle date ?','J’aimerais obtenir un remboursement.'],rules:[
            v580Rule([['je voudrais','j aimerais','pouvez vous','est ce que vous pouvez'],['livraison','nouvelle date','remboursement','solution','reprogrammer']],'confirm','request','request','Pouvez-vous me proposer une nouvelle date de livraison ?',{minWords:6})
          ]},
          confirm:{npc:'Je peux programmer une nouvelle livraison vendredi matin. Cela vous convient ?',hint:'Accept, reject, or adjust the proposal.',phrases:['Oui, vendredi matin me convient.','Vendredi matin est difficile ; plutôt l’après-midi, si possible.'],rules:[
            v580Rule([['oui','me convient','difficile','plutôt','plutot','si possible','non']],'close','confirm','confirm','Oui, vendredi matin me convient.',{minWords:3})
          ]},
          close:{npc:'Très bien, c’est enregistré. Autre chose ?',hint:'Close the exchange politely.',phrases:['Non, c’est tout. Merci pour votre aide.','Non merci, bonne journée.'],rules:[
            v580Rule([['non','c est tout','cest tout','merci','bonne journée','bonne journee']],'end','close','close','Non, c’est tout. Merci pour votre aide.',{minWords:2})
          ]},
          end:{end:true,npc:'Avec plaisir. Bonne journée !'}
        }
      },
      {
        id:'work-policy-debate',title:'Defend a workplace policy',level:'B2',duration:'challenge',setting:'Management meeting',
        goal:'Evaluate a proposal, qualify its limits, answer an objection, explore consequences, negotiate a condition, and synthesize the decision.',
        functions:['evaluate','qualify','persuade','hypothesize','negotiate','synthesize'],
        targets:['cependant','dans la mesure où','à condition que','conséquence','compromis','en revanche'],
        requiredGoals:['evaluation','nuance','objection','consequence','condition','summary'],start:'evaluation',variantCount:4,
        nodes:{
          evaluation:{npcVariants:['Nous envisageons trois jours de télétravail par semaine. Quel est votre avis ?','La direction propose de réduire les réunions en présentiel. Comment évaluez-vous cette idée ?','Nous voulons rendre les horaires plus flexibles. Quels seraient les principaux avantages et risques ?','Un système hybride permanent est proposé. Quels critères faut-il examiner ?'],hint:'Evaluate the proposal with at least one benefit and one limitation.',phrases:["Cette mesure peut améliorer la flexibilité, mais elle risque aussi de compliquer la coordination.","L'idée est intéressante, à condition de distinguer les tâches qui exigent une présence commune."],rules:[
            v580Rule([['peut','pourrait','avantage','intéressant','interessant'],['mais','cependant','risque','limite','à condition','a condition']],'nuance','evaluation','evaluate',"Cette mesure peut améliorer la flexibilité, mais elle risque de compliquer la coordination.",{minWords:10})
          ]},
          nuance:{npc:'Vous semblez favorable, mais pas sans réserve. Pouvez-vous préciser ?',hint:'Qualify the claim rather than taking an absolute position.',phrases:["Je suis plutôt favorable, dans la mesure où les équipes gardent des moments communs.","Cela dépend surtout des fonctions ; la même règle ne convient pas nécessairement à tous."],rules:[
            v580Rule([['dans la mesure','cela dépend','ca depend','pas nécessairement','pas necessairement','plutôt','plutot']],'objection','nuance','qualify',"Je suis favorable dans la mesure où les équipes gardent des moments communs.",{minWords:9})
          ]},
          objection:{npc:"Certains responsables disent pourtant que la productivité baisse dès qu'on travaille à distance.",hint:'Respond persuasively without pretending the objection is irrelevant.',phrases:["Cette inquiétude est légitime, mais on devrait comparer des résultats mesurables plutôt que supposer une baisse automatique.","Je comprends l'objection ; néanmoins, des objectifs clairs permettraient de vérifier si elle se confirme."],rules:[
            v580Rule([['je comprends','légitime','legitime','néanmoins','neanmoins','cependant','mais'],['résultat','resultat','mesurer','vérifier','verifier','comparer','objectif']],'consequence','objection','persuade',"Je comprends l'objection, mais il faudrait comparer des résultats mesurables.",{minWords:11})
          ]},
          consequence:{npc:'Que se passerait-il si nous appliquions la même règle à tous les services ?',hint:'Explore a plausible consequence using conditional reasoning.',phrases:["Si la même règle s'appliquait partout, certains services pourraient perdre en efficacité.","On risquerait de créer des inégalités entre les postes si les contraintes réelles n'étaient pas prises en compte."],rules:[
            v580Rule([['si'],['pourrait','risquerait','serait','aurait','perdrait','créerait','creerait']],'condition','consequence','hypothesize',"Si la même règle s'appliquait partout, certains services pourraient perdre en efficacité.",{minWords:10})
          ]},
          condition:{npc:'Quelle condition proposeriez-vous pour avancer ?',hint:'Negotiate a concrete safeguard or compromise.',phrases:["Je proposerais une période d'essai de trois mois, à condition qu'on évalue ensuite les résultats.","On pourrait accepter le principe, mais prévoir une exception pour les équipes qui ont besoin d'une présence quotidienne."],rules:[
            v580Rule([['je proposerais','on pourrait','accepter','compromis','à condition','a condition'],['évaluer','evaluer','exception','période','periode','résultat','resultat','équipe','equipe']],'summary','condition','negotiate',"Je proposerais une période d'essai, à condition qu'on évalue ensuite les résultats.",{minWords:10})
          ]},
          summary:{npc:'Très bien. Résumez la position que nous pouvons retenir.',hint:'Synthesize the balanced conclusion.',phrases:["Nous pouvons retenir le travail hybride, mais avec des règles adaptées aux métiers, une période d'essai et une évaluation commune.","En résumé, le principe est accepté à condition de préserver la coordination et de mesurer les effets."],rules:[
            v580Rule([['en résumé','en resume','nous pouvons retenir','le principe'],['mais','à condition','a condition','avec']],'end','summary','synthesize',"En résumé, le principe est accepté à condition de préserver la coordination et de mesurer les effets.",{minWords:11})
          ]},
          end:{end:true,npc:'Merci. La proposition sera reformulée sur cette base.'}
        }
      },
      {
        id:'civic-transport-debate',title:'Debate a city transport policy',level:'B2',duration:'challenge',setting:'Public consultation',
        goal:'Evaluate a public policy, nuance competing interests, persuade with reasons, mediate disagreement, and synthesize a workable compromise.',
        functions:['evaluate','qualify','persuade','mediate','hypothesize','synthesize'],
        targets:['équitable','restriction','alternative','en revanche','à long terme','compromis'],
        requiredGoals:['evaluation','nuance','case','mediation','consequence','summary'],start:'evaluation',variantCount:4,
        nodes:{
          evaluation:{npcVariants:["La ville veut limiter fortement les voitures dans le centre. Comment jugez-vous cette mesure ?","Un péage urbain est envisagé. Quels effets faut-il examiner ?","La municipalité veut supprimer une partie des places de stationnement. Est-ce une bonne politique ?","Les tarifs de stationnement augmenteraient pour financer les transports publics. Qu'en pensez-vous ?"],hint:'Evaluate both the intended benefit and a distributional risk.',phrases:["La mesure peut réduire la pollution, mais elle risque d'être injuste pour ceux qui n'ont pas d'alternative.","L'objectif est pertinent, cependant il faut examiner qui supportera réellement le coût."],rules:[
            v580Rule([['peut','objectif','pertinent','utile'],['mais','cependant','risque','coût','cout','injuste','équitable','equitable']],'nuance','evaluation','evaluate',"La mesure peut réduire la pollution, mais elle risque d'être injuste pour ceux qui n'ont pas d'alternative.",{minWords:11})
          ]},
          nuance:{npc:'Faut-il donc renoncer à la mesure ?',hint:'Reject the false binary and qualify your position.',phrases:["Pas forcément ; je pense qu'elle est défendable si des alternatives crédibles existent.","Je ne dirais pas qu'il faut renoncer, mais plutôt adapter la mesure selon les quartiers et les horaires."],rules:[
            v580Rule([['pas forcément','pas forcement','je ne dirais pas','plutôt','plutot','si'],['adapter','alternative','quartier','horaire','condition']],'case','nuance','qualify',"Pas forcément ; elle est défendable si des alternatives crédibles existent.",{minWords:9})
          ]},
          case:{npc:'Convainquez un habitant qui pense que cette politique ne fera que compliquer sa vie.',hint:'Make a persuasive case with a concrete safeguard.',phrases:["Je comprends cette crainte, mais si l'offre de bus augmente réellement, vous pourriez avoir une alternative moins coûteuse.","La restriction serait plus acceptable si les recettes servaient directement à améliorer les transports des quartiers périphériques."],rules:[
            v580Rule([['je comprends','acceptable','mais','si'],['transport','bus','recette','alternative','quartier','améliorer','ameliorer']],'mediation','case','persuade',"Je comprends cette crainte, mais la mesure serait plus acceptable si les transports étaient améliorés.",{minWords:11})
          ]},
          mediation:{npc:"Un autre participant répond que toute exception affaiblira la politique. Comment rapprochez-vous les deux positions ?",hint:'Mediate by naming the legitimate concern on each side and a shared criterion.',phrases:["Les deux positions cherchent un système efficace ; on peut limiter les exceptions dans le temps tout en protégeant les personnes sans solution réaliste.","On pourrait définir des critères transparents : l'objectif reste la réduction du trafic, mais sans pénaliser ceux qui n'ont aucune alternative."],rules:[
            v580Rule([['les deux','on pourrait','critère','critere','objectif commun','tout en'],['exception','alternative','trafic','protéger','proteger','efficace']],'consequence','mediation','mediate',"On pourrait définir des critères transparents tout en gardant l'objectif de réduction du trafic.",{minWords:12})
          ]},
          consequence:{npc:"Et si les transports publics ne s'amélioraient pas assez vite ?",hint:'Hypothesize about consequences and adjustment.',phrases:["Dans ce cas, la restriction risquerait d'être perçue comme punitive et il faudrait ralentir son calendrier.","Si l'offre restait insuffisante, on devrait reporter certaines étapes plutôt que maintenir le même rythme."],rules:[
            v580Rule([['si','dans ce cas'],['risquerait','faudrait','devrait','reporter','ralentir','punitive']],'summary','consequence','hypothesize',"Si l'offre restait insuffisante, il faudrait ralentir le calendrier.",{minWords:10})
          ]},
          summary:{npc:'Quelle recommandation finale formulez-vous ?',hint:'Synthesize the compromise in one balanced recommendation.',phrases:["Je recommande une réduction progressive du trafic, liée à des objectifs mesurables d'amélioration des transports et à des exceptions ciblées.","En résumé, la politique peut avancer si elle combine contrainte, alternatives crédibles et suivi public des résultats."],rules:[
            v580Rule([['je recommande','en résumé','en resume'],['progressif','alternative','résultat','resultat','suivi','exception','transport']],'end','summary','synthesize',"En résumé, la politique peut avancer si elle combine contrainte, alternatives crédibles et suivi des résultats.",{minWords:12})
          ]},
          end:{end:true,npc:'Merci. Votre proposition sera ajoutée au compte rendu.'}
        }
      },
      {
        id:'project-crisis',title:'Resolve a project crisis',level:'B2',duration:'challenge',setting:'Project review',
        goal:'Diagnose a project failure, evaluate options, hypothesize consequences, negotiate trade-offs, mediate priorities, and conclude.',
        functions:['explain','evaluate','hypothesize','negotiate','mediate','synthesize'],
        targets:['priorité','délai','risque','renoncer','compromis','conséquence'],
        requiredGoals:['diagnosis','options','consequence','tradeoff','mediation','summary'],start:'diagnosis',variantCount:4,
        nodes:{
          diagnosis:{npcVariants:["Le projet a deux semaines de retard et le budget est presque épuisé. Comment expliquez-vous la situation ?","Un fournisseur vient d'annuler une livraison essentielle. Quelle est votre lecture de la situation ?","L'équipe a découvert un défaut important avant le lancement. Que faut-il comprendre d'abord ?","Deux tâches critiques ne peuvent pas être terminées à temps. Comment diagnostiquez-vous le problème ?"],hint:'Explain the problem structurally rather than blaming one person.',phrases:["Le retard vient surtout du fait que plusieurs dépendances ont été sous-estimées, pas d'une seule erreur individuelle.","Le principal problème est que nous avons gardé trop de priorités alors que les ressources ont diminué."],rules:[
            v580Rule([['problème','principal','vient','parce que','du fait que'],['retard','priorité','priorite','ressource','dépendance','dependance','budget','risque']],'options','diagnosis','explain',"Le principal problème est que nous avons gardé trop de priorités alors que les ressources ont diminué.",{minWords:11})
          ]},
          options:{npc:'Nous pouvons réduire le périmètre, repousser la date ou demander davantage de moyens. Comment évaluez-vous ces options ?',hint:'Compare trade-offs explicitly.',phrases:["Repousser la date protège la qualité mais augmente les coûts ; réduire le périmètre limite le délai mais oblige à renoncer à certaines fonctions.","Demander plus de moyens peut aider, cependant cela ne résout pas les dépendances les plus lentes."],rules:[
            v580Rule([['mais','cependant','en revanche'],['date','coût','cout','périmètre','perimetre','moyen','qualité','qualite','délai','delai']],'consequence','options','evaluate',"Repousser la date protège la qualité mais augmente les coûts, tandis que réduire le périmètre limite le délai.",{minWords:12})
          ]},
          consequence:{npc:'Que se passerait-il si nous gardions le plan actuel ?',hint:'State a plausible conditional consequence.',phrases:["Si nous gardions le plan actuel, nous risquerions de livrer en retard avec une qualité insuffisante.","On pourrait respecter certaines fonctions, mais le risque d'épuiser l'équipe augmenterait."],rules:[
            v580Rule([['si','pourrait','risquerait','augmenterait','serait'],['retard','qualité','qualite','risque','équipe','equipe']],'tradeoff','consequence','hypothesize',"Si nous gardions le plan actuel, nous risquerions de livrer en retard avec une qualité insuffisante.",{minWords:10})
          ]},
          tradeoff:{npc:'Quelle concession êtes-vous prêt à proposer ?',hint:'Negotiate a specific trade-off.',phrases:["Je proposerais de reporter deux fonctions secondaires afin de préserver la date et les éléments critiques.","Nous pourrions accepter une semaine de délai en échange d'un contrôle qualité complet."],rules:[
            v580Rule([['je proposerais','nous pourrions','accepter','en échange','afin de'],['reporter','délai','delai','fonction','qualité','qualite','date']],'mediation','tradeoff','negotiate',"Je proposerais de reporter deux fonctions secondaires afin de préserver les éléments critiques.",{minWords:10})
          ]},
          mediation:{npc:"L'équipe technique veut plus de temps ; la direction refuse de déplacer la date. Comment rapprocher les priorités ?",hint:'Mediate by identifying shared interests and a bounded compromise.',phrases:["Les deux parties veulent éviter un échec visible ; on peut donc maintenir la date pour un périmètre réduit et planifier le reste ensuite.","On pourrait conserver la date publique tout en limitant la première version aux fonctions réellement stables."],rules:[
            v580Rule([['les deux','on peut','on pourrait','tout en'],['date','périmètre','perimetre','fonction','stable','reste','échec','echec']],'summary','mediation','mediate',"Les deux parties veulent éviter un échec ; on peut maintenir la date avec un périmètre réduit.",{minWords:11})
          ]},
          summary:{npc:'Formulez le plan final en une recommandation.',hint:'Synthesize diagnosis, trade-off, and next step.',phrases:["Nous réduisons le périmètre de la première version, gardons la date et réévaluons les fonctions reportées après le lancement.","En résumé, nous protégeons les éléments critiques maintenant et fixons une seconde étape pour le reste."],rules:[
            v580Rule([['en résumé','en resume','nous réduisons','nous gardons','nous protégeons','nous protegeons'],['maintenant','ensuite','après','apres','étape','etape','reste','report']],'end','summary','synthesize',"En résumé, nous protégeons les éléments critiques maintenant et fixons une seconde étape pour le reste.",{minWords:11})
          ]},
          end:{end:true,npc:'D’accord. Nous documentons cette décision et les critères de suivi.'}
        }
      },
      {
        id:'media-claim',title:'Assess a disputed media claim',level:'B2',duration:'challenge',setting:'Editorial discussion',
        goal:'Evaluate evidence, qualify certainty, explain limitations, justify a conclusion, and synthesize what can responsibly be claimed.',
        functions:['evaluate','qualify','explain','justify','persuade','synthesize'],
        targets:['source','preuve','fiable','biais','incertain','conclusion'],
        requiredGoals:['evidence','certainty','limits','reason','case','summary'],start:'evidence',variantCount:4,
        nodes:{
          evidence:{npcVariants:["Une publication affirme qu'une étude prouve que le nouveau programme double les résultats. Que vérifiez-vous ?","Un article viral dit qu'un produit est sans risque. Comment évaluez-vous cette affirmation ?","Deux médias donnent des chiffres très différents sur le même sujet. Par quoi commencez-vous ?","Une vidéo cite un sondage pour affirmer que tout le public est d'accord. Que faut-il examiner ?"],hint:'Evaluate source quality and what the evidence actually measures.',phrases:["Je vérifierais la source originale, la méthode et ce que les chiffres mesurent réellement.","Il faut d'abord savoir si la source est fiable et si les données soutiennent exactement cette conclusion."],rules:[
            v580Rule([['source','méthode','methode','donnée','donnee','preuve','fiable','échantillon','echantillon'],['vérifier','verifier','examiner','mesurer','soutiennent']],'certainty','evidence','evaluate',"Je vérifierais la source originale, la méthode et ce que les chiffres mesurent réellement.",{minWords:10})
          ]},
          certainty:{npc:'Supposons que les chiffres soient exacts. Peut-on reprendre le titre tel quel ?',hint:'Qualify certainty and avoid overclaiming.',phrases:["Pas nécessairement : les chiffres peuvent être exacts sans prouver une relation de cause à effet.","On peut dire que l'étude observe une association, mais pas qu'elle démontre à elle seule la cause."],rules:[
            v580Rule([['pas nécessairement','pas necessairement','on peut dire','mais pas','sans prouver','à elle seule','a elle seule']],'limits','certainty','qualify',"Les chiffres peuvent être exacts sans prouver une relation de cause à effet.",{minWords:10})
          ]},
          limits:{npc:"Expliquez cette limite à quelqu'un qui n'a pas de formation statistique.",hint:'Explain the limitation clearly.',phrases:["Deux phénomènes peuvent évoluer ensemble pour plusieurs raisons ; cela ne montre pas automatiquement que l'un provoque l'autre.","L'étude peut repérer un lien sans avoir éliminé toutes les autres explications possibles."],rules:[
            v580Rule([['cela ne','sans','plusieurs raisons','autre explication','lien'],['provoque','cause','montrer','éliminé','elimine','automatiquement']],'reason','limits','explain',"Un lien statistique ne montre pas automatiquement que l'un des phénomènes provoque l'autre.",{minWords:11})
          ]},
          reason:{npc:'Quelle conclusion vous paraît alors justifiée ?',hint:'Justify a narrower conclusion.',phrases:["Je dirais que les résultats sont intéressants mais qu'ils doivent être confirmés par d'autres travaux.","La conclusion raisonnable est qu'il existe un signal, pas encore une preuve définitive."],rules:[
            v580Rule([['je dirais','conclusion','raisonnable','parce que','puisque'],['intéressant','interessant','confirmer','signal','preuve','définitive','definitive']],'case','reason','justify',"La conclusion raisonnable est qu'il existe un signal, pas encore une preuve définitive.",{minWords:10})
          ]},
          case:{npc:"L'éditeur veut pourtant un titre très affirmatif. Convainquez-le de rester précis.",hint:'Persuade using credibility and long-term consequences.',phrases:["Un titre plus prudent protège notre crédibilité : si nous affirmons davantage que les données, nous risquons de tromper les lecteurs.","Être précis n'affaiblit pas l'article ; cela montre que nous distinguons ce qui est établi de ce qui reste incertain."],rules:[
            v580Rule([['crédibilité','credibilite','précis','precis','lecteur','tromper','incertain'],['risque','montre','protège','protege','n affaiblit pas','ne affaiblit pas']],'summary','case','persuade',"Un titre plus prudent protège notre crédibilité et évite d'affirmer davantage que les données.",{minWords:11})
          ]},
          summary:{npc:'Donnez la formulation finale.',hint:'Synthesize evidence and uncertainty in one responsible claim.',phrases:["L'étude observe une amélioration importante, mais ses résultats ne suffisent pas encore à établir une causalité générale.","En résumé, les données soutiennent une association prometteuse qui doit encore être confirmée."],rules:[
            v580Rule([['en résumé','en resume','l étude','letude','les données','les donnees'],['mais','association','causalité','causalite','confirmer','suffisent']],'end','summary','synthesize',"En résumé, les données soutiennent une association prometteuse qui doit encore être confirmée.",{minWords:11})
          ]},
          end:{end:true,npc:'Très bien. Cette formulation distingue clairement résultat et interprétation.'}
        }
      },
      {
        id:'team-conflict',title:'Mediate a team conflict',level:'B2',duration:'challenge',setting:'Team mediation',
        goal:'Represent opposing positions fairly, qualify assumptions, explore consequences, negotiate a compromise, persuade both sides, and synthesize commitments.',
        functions:['mediate','qualify','hypothesize','negotiate','persuade','synthesize'],
        targets:['désaccord','priorité','reconnaître','compromis','si','engagement'],
        requiredGoals:['positions','nuance','consequence','compromise','case','summary'],start:'positions',variantCount:4,
        nodes:{
          positions:{npcVariants:["Deux collègues se reprochent mutuellement les retards du projet. Comment reformulez-vous leurs positions ?","L'équipe commerciale veut ajouter des demandes ; l'équipe technique veut geler le périmètre. Comment présentez-vous le désaccord ?","Deux responsables ne sont pas d'accord sur la priorité du trimestre. Comment résumez-vous leurs préoccupations ?","Une équipe veut aller vite, l'autre veut davantage de contrôle. Comment formulez-vous le conflit sans prendre parti ?"],hint:'Mediate by representing both sides fairly.',phrases:["D'un côté, l'équipe veut protéger le délai ; de l'autre, elle veut éviter une solution fragile. Les deux préoccupations sont légitimes.","Les deux parties cherchent à réussir le projet, mais elles donnent un poids différent à la vitesse et au risque."],rules:[
            v580Rule([['d un côté','dun côté','d un cote','les deux','de l autre','mais'],['équipe','equipe','priorité','priorite','risque','délai','delai','vitesse','qualité','qualite']],'nuance','positions','mediate',"Les deux parties cherchent à réussir le projet, mais elles donnent un poids différent à la vitesse et au risque.",{minWords:12})
          ]},
          nuance:{npc:"Quelle hypothèse de chaque camp mérite d'être nuancée ?",hint:'Identify an assumption that may be too absolute.',phrases:["L'équipe technique suppose peut-être que toute nouvelle demande est dangereuse, ce qui n'est pas nécessairement vrai.","Le service commercial semble penser que chaque demande est urgente, alors que certaines peuvent attendre."],rules:[
            v580Rule([['peut-être','peut etre','pas nécessairement','pas necessairement','semble','alors que'],['suppose','pense','urgent','attendre','dangereux','demande']],'consequence','nuance','qualify',"Le service commercial semble penser que chaque demande est urgente, alors que certaines peuvent attendre.",{minWords:10})
          ]},
          consequence:{npc:'Que risque-t-il de se passer si personne ne change de position ?',hint:'Hypothesize about the likely consequence.',phrases:["Si chacun maintient sa position, le conflit risque de retarder les décisions et de réduire la confiance.","On pourrait perdre du temps à négocier chaque détail au lieu de définir des critères communs."],rules:[
            v580Rule([['si','pourrait','risque','risquerait'],['conflit','retard','décision','decision','confiance','temps','critère','critere']],'compromise','consequence','hypothesize',"Si chacun maintient sa position, le conflit risque de retarder les décisions et de réduire la confiance.",{minWords:10})
          ]},
          compromise:{npc:'Proposez un compromis concret.',hint:'Negotiate a bounded compromise with a rule for future cases.',phrases:["On pourrait geler le périmètre principal tout en réservant une petite capacité aux demandes réellement urgentes.","Je propose un seuil commun : toute nouvelle demande doit remplacer une priorité existante, sauf urgence clairement justifiée."],rules:[
            v580Rule([['on pourrait','je propose','compromis','tout en','sauf'],['priorité','priorite','urgence','demande','capacité','capacite','remplacer','périmètre','perimetre']],'case','compromise','negotiate',"On pourrait geler le périmètre principal tout en réservant une petite capacité aux demandes urgentes.",{minWords:11})
          ]},
          case:{npc:'Pourquoi les deux parties devraient-elles accepter ?',hint:'Persuade by connecting the compromise to each side’s interest.',phrases:["Cette règle protège la stabilité recherchée par l'équipe technique tout en laissant une marge pour les besoins commerciaux vraiment prioritaires.","Chacun obtient une garantie importante : la charge reste contrôlée et les urgences ne sont pas bloquées automatiquement."],rules:[
            v580Rule([['protège','protege','garantie','chacun','tout en'],['stabilité','stabilite','charge','urgence','prioritaire','marge','besoin']],'summary','case','persuade',"Cette règle protège la stabilité tout en laissant une marge pour les besoins réellement prioritaires.",{minWords:11})
          ]},
          summary:{npc:'Résumez les engagements convenus.',hint:'Synthesize the agreement and the decision rule.',phrases:["Nous gardons le périmètre principal stable, toute nouvelle demande doit être priorisée explicitement, et une exception exige une justification commune.","En résumé, les deux équipes utiliseront les mêmes critères et réexamineront le compromis après le prochain cycle."],rules:[
            v580Rule([['en résumé','en resume','nous gardons','les deux équipes','les deux equipes'],['critère','critere','priorité','priorite','exception','réexaminer','reexaminer','cycle']],'end','summary','synthesize',"En résumé, les deux équipes utiliseront les mêmes critères et réexamineront le compromis après le prochain cycle.",{minWords:11})
          ]},
          end:{end:true,npc:'Parfait. Les critères et les responsabilités sont maintenant explicites.'}
        }
      }
    ]
);
export function getP35SourceScenario(id:string):P35Graph|undefined{return P35_SOURCE_SCENARIOS.find(s=>s.id===id);}
