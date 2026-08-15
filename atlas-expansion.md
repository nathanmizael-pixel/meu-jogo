# Expansão do Atlas — Auditoria e Direção

## Auditoria atual

O jogo mantém o mundo em `client/src/lib/gameData.ts`. O atlas possui sete regiões com nível de desbloqueio, bioma, clima e marco narrativo, enquanto `Home.tsx` mantém a seleção de região e usa uma lista fixa de três inimigos para o campo de batalha. O combate atual é direto: o jogador seleciona um alvo, golpeia ou usa um dos dois feitiços, recebe dano de retorno e, ao derrotar um inimigo, gera um cadáver, XP e ouro.

A principal oportunidade de expansão é separar o **encontro** da **região**. Assim, uma área pode oferecer vários tipos de situação sem perder a leitura cartográfica: patrulha, emboscada, elite, ritual de cerco e chefe. A implementação continuará compatível com o estado atual, mantendo uma lista de inimigos ativa e acrescentando metadados de encontro, efeitos especiais e recompensas contextuais.

## Escopo narrativo aprovado

| Nova região | Acesso | Fantasia de exploração | Encontro assinatura |
| --- | ---: | --- | --- |
| Cripta das Marés | Nv. 3 | Catacumbas inundadas sob a costa, com sinos submersos e cadáveres presos às correntes | Maré dos Afogados: a cada rodada, um espectro retorna com menos vida |
| Jardim de Espinhos | Nv. 5 | Estufa funerária onde raízes bebem sangue e flores guardam nomes | Pacto da Rosa Negra: o inimigo cura quando o jogador usa golpe comum |
| Observatório do Eclipse | Nv. 8 | Torre astral quebrada, onde sombras chegam antes dos corpos | Céu sem Lua: um inimigo é ocultado até ser atingido por magia |
| Cidadela do Sal Negro | Nv. 12 | Fortaleza de sal mineral que abriga uma ordem necromântica rival | Cerco dos Nove Selos: dois guardiões protegem um hierofante |

## Critérios de verificação

Cada região nova deverá aparecer no mapa com coordenada visual, estado de bloqueio e detalhe de bioma. Ao ser aberta, ela precisa trocar o marco e o clima do cabeçalho, carregar um encontro próprio e manter o botão “Partir para cá” funcional. O registro de campo deve anunciar o tipo de encontro e o combate deve expor pelo menos uma diferença perceptível entre inimigos comuns, elites e chefes.
