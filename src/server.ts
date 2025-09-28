import app from './app';

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log(`POST /balance/:userId?provider=poke`);
  console.log(`POST /debit/:userId?provider=poke`);
  console.log(`POST /credit/:userId?provider=poke`);
});