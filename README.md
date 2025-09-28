# api-node-providers

Módulo para integración de proveedores externos.

## Características

- Integración con PokeAPI y OpenMeteo como proveedores iniciales.
- Módulo BaseProvider para la integración de nuevos proveedores de manera sencilla.
- Tests unitarios con Jest.

## Proveedores Actuales
1. **PokeAPI** (poke)
2. **OpenMeteo** (openmeteo)

## Instalación
1. Clonar el repositorio:
```bash
git clone <repository-url>
cd api-node-providers
```
2. Instalar dependencias
```bash
npm install
```

## Uso
1. Desarrollo
```bash
npm run dev
```
2. Producción
```bash
npm run build
npm start
```
3. Pruebas
```bash
npm test
```

## Endpoints
1. **Obtener Balance**
```bash
POST /balance/:userId?provider=poke|openmeteo
```
2. **Realizar Débito**
```bash
POST /debit/:userId?provider=poke|openmeteo
Content-Type: application/json

{
  "amount": 100
}
```
3. **Realizar Crédito**
```bash
POST /credit/:userId?provider=poke|openmeteo
Content-Type: application/json

{
  "amount": 100
}
```
Ejemplo de uso
```bash
#Obetener Balance
curl -X POST http://localhost:3000/balance/pikachu?provider=poke

# Debitar 100 de Pikachu
curl -X POST http://localhost:3000/debit/pikachu?provider=poke -H "Content-Type: application/json" -d '{"amount": 100}'
```