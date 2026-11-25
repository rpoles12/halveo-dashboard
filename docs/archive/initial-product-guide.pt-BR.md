# Halveo — Guia de Produto
### RUPTIVE® — material fictício de direcionamento estratégico

---

## 1. O que o produto é

Halveo não é um "dashboard de sustentabilidade". É uma **plataforma de observabilidade operacional aplicada a recursos críticos** — água, energia e outros insumos mensuráveis. O resultado ambiental é uma leitura possível do produto, nunca a promessa central.

Modelo mental em quatro funções, nessa ordem:

1. **Medir** — capturar dado contínuo de consumo, substituindo a leitura manual/pontual que a empresa fazia como EcoSense.
2. **Comparar** — colocar o dado contra uma referência: histórico da própria operação, benchmark de setor, meta contratual.
3. **Explicar** — identificar onde e por que o desperdício acontece, não apenas quanto.
4. **Recomendar** — sugerir a correção, com impacto estimado, sem prometer o resultado antes da ação ser tomada.

**Posicionamento correto:** infraestrutura de decisão operacional.
**Posicionamento a evitar:** software de sustentabilidade corporativa.

---

## 2. Arquitetura de módulos

| Módulo | Função | Por que existe |
|---|---|---|
| Ingestão de dados | Conecta com medidores, sensores IoT, sistemas legados (SCADA, ERPs industriais) ou permite entrada manual | Fundação do princípio "dado antes de opinião" |
| Diagnóstico | Auditoria estruturada digitalizada — herda o método original da EcoSense | Ponto de entrada para clientes sem sensoriamento maduro |
| Monitoramento contínuo | Consumo em tempo real (ou quase) por recurso, unidade e linha | Transforma a empresa de consultoria em produto recorrente |
| Motor de anomalias | Detecta desvios de padrão — vazamento, pico fora de horário, equipamento fora do esperado | Prova de valor contínua, mesmo sem interação do usuário |
| Motor de recomendação | Sugere ações concretas com impacto estimado | Sem isso o produto só descreve o problema — insuficiente para preço enterprise |
| Rastreamento de resultado (ROI) | Acompanha se a ação foi implementada e mede o efeito real depois | Valida o nome Halveo com dado, não com discurso |
| Relatórios ESG-ready | Exporta documentação formatada para relatório de sustentabilidade, auditoria, investidores | Atende à audiência secundária sem contaminar o discurso primário |
| Administração multi-site / multi-usuário | Papéis de acesso, múltiplas unidades, permissões por função | Requisito não-negociável para o mercado enterprise |
| Confiabilidade de dado | Mostra a origem/qualidade de cada dado (calibrado, manual, estimado) | Sustenta o atributo "confiabilidade silenciosa" com transparência real |

### Fases de lançamento recomendadas

- **Fase 1 (MVP):** Ingestão, Diagnóstico, Monitoramento contínuo, Motor de anomalias, Confiabilidade de dado. O produto nasce **descritivo**.
- **Fase 2:** Motor de recomendação e Rastreamento de resultado (ROI). O produto se torna **prescritivo** — só depois de o dado histórico existir para sustentar recomendações confiáveis.
- **Relatórios ESG:** tratados como **módulo gerado a partir do mesmo dado**, não como produto paralelo — evita duplicar fonte de verdade e mantém o discurso primário (operação) separado do secundário (compliance) sem duas plataformas.

---

## 3. O que o dashboard mostra

Três visões, uma por audiência — porque operação, executivo e ESG/compliance não decidem pelas mesmas informações.

### 3.1 Visão Operação (uso diário, técnico)

- Consumo atual por recurso e por unidade/linha/equipamento, com granularidade de tempo ajustável
- Comparação com baseline histórica da própria operação (nunca um número genérico de mercado)
- Alertas de anomalia ativos, com severidade e localização exata
- Recomendações pendentes, com impacto estimado e esforço de implementação
- Indicador de confiança do dado (sensor calibrado vs. estimativa)

### 3.2 Visão Executiva (liderança, tomada de decisão)

- Economia acumulada no período — em volume **e** em valor financeiro
- Progresso frente à meta definida (contratual ou interna)
- Comparação entre unidades/plantas — onde está a maior oportunidade de ganho
- Tendência de 12 meses (nunca só o instantâneo)

### 3.3 Visão ESG / Compliance (relatório, auditoria externa)

- Totais consolidados por período, formatados para os frameworks já usados pelo cliente (GRI, CDP, etc.)
- Trilha de auditoria — o que foi medido, quando, com qual método
- Evolução ano a ano, demonstrando consistência de melhoria, não pico isolado

### 3.4 Princípio transversal — vale para as três visões

O número vem antes da interpretação. Todo dashboard mostra primeiro o dado bruto e a variação; a leitura ("isso significa X de economia") vem depois, de forma discreta — nunca como manchete. A interface é a prova do que o nome Halveo promete, não um reforço adicional da promessa.

---

## 4. Decisões em aberto para validação com Rafael

- Confirmar se a Fase 1 realmente deve nascer sem o motor de recomendação, ou se um cliente-piloto específico já justifica antecipar essa funcionalidade.
- Definir se relatórios ESG ficam disponíveis para todos os planos ou como add-on comercial — decisão de precificação, não de produto.
- Mapear quais frameworks ESG (GRI, CDP, outros) são prioritários conforme o perfil real dos primeiros clientes-alvo.
