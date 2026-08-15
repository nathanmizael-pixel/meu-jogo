# Sistema de Recompensas Regionais

Cada uma das quatro regiões adicionadas ao atlas terá uma **relíquia única** e um bônus de experiência associado à conclusão de qualquer encontro daquela região. A relíquia só pode ser registrada uma vez, enquanto o bônus de experiência continua disponível em novas vitórias para que os encontros permaneçam úteis durante a exploração.

| Região | Relíquia única | Efeito real | Bônus de XP | Bônus de primeiro clear |
| --- | --- | --- | ---: | ---: |
| Cripta das Marés | Coração de Maré | +8 mana máxima | +80 XP | +25 ouro |
| Jardim de Espinhos | Corola da Rosa Negra | +4 poder | +95 XP | +35 ouro |
| Observatório do Eclipse | Lente de Perigeu | +1 espaço de feitiço | +120 XP | +45 ouro |
| Cidadela do Sal Negro | Selo Negro | +22 vitalidade máxima | +160 XP | +60 ouro |

O encontro concede o bônus regional quando todos os inimigos foram derrotados e o inimigo não retornará por uma regra de maré. A primeira conclusão também grava a relíquia no Inventário, aplica o efeito ao personagem e entrega o ouro de marco. Vitórias posteriores mantêm o bônus de XP, mas não duplicam a relíquia nem o ouro de primeiro clear.

O estado `relics` vive dentro do jogador e o estado `clearedEncounters` é persistido no save local. Dessa forma, itens únicos, bônus já registrados e encontros concluídos continuam consistentes após recarregar o navegador.
