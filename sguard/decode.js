const fs = require('node:fs')
const path = require("node:path")
const raw = fs.readFileSync(path.join(__dirname, "docs", "message.txt"), {encoding: "utf8"})

const regexp = raw.match(/Resumo da sua conta(?<target>.*)Aplicativo CELESC/is)
if(!regexp?.groups?.target) {
    console.log("informações de faturan não encontradas")
    process.exit(1)    
}

/**
Mês de referência:      05/2025
Consumo registrado:     240 kWh
Número de dias faturados:       29 dias
Data de vencimento:     16/06/2025
Valor da fatura:        R$ 0,00
**/
const patterns = [
    {p: "Valor da fatura:\\s+R\\$\\s+(?<v>\\d+,\\d+)\n", k: "valor"},
    {p: "Data de vencimento:\\s+(?<v>\\d+\/\\d+\/\\d+)\n", k: "vencimento"},
    {p: "Número de dias faturados:\\s+(?<v>\\d+)\\sdias", k: "dias"},
    {p: "Consumo registrado:\\s+(?<v>\\d+\\skWh)\n", k: "consumo"},
    {p: "Mês de referência:\\s+(?<v>\\d+\/\\d+)\n", k: "referencia"},
];

const data = {}
for (const o of patterns) {
    const r = new RegExp(o.p, "m")
    const t = regexp.groups.target.match(r)
    data[o.k] = t.groups.v ?? null    
}
console.log(data)