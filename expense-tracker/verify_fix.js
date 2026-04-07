import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

async function verify() {
  try {
    console.log('--- Registering User A ---');
    try {
      await axios.post(`${API_URL}/auth/register`, {
        email: 'usera1@test.com',
        password: 'password123',
        firstName: 'User',
        lastName: 'A'
      });
    } catch(e) { /* might already exist */ }

    const loginA = await axios.post(`${API_URL}/auth/login`, {
      email: 'usera1@test.com',
      password: 'password123'
    });
    const tokenA = loginA.data.token;
    console.log('User A logged in.');

    await axios.post(`${API_URL}/expenses`, {
      title: 'Lunch',
      amount: 500,
      category: 'Food & Dining',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    }, { headers: { Authorization: `Bearer ${tokenA}` } });
    console.log('User A added expense of 500 to Food & Dining.');

    const spendingA = await axios.get(`${API_URL}/budgets/spending`, {
       headers: { Authorization: `Bearer ${tokenA}` }
    });
    console.log('User A spending profile:', spendingA.data);

    console.log('\n--- Registering User B ---');
    try {
      await axios.post(`${API_URL}/auth/register`, {
        email: 'userb1@test.com',
        password: 'password123',
        firstName: 'User',
        lastName: 'B'
      });
    } catch(e) { /* might already exist */ }

    const loginB = await axios.post(`${API_URL}/auth/login`, {
      email: 'userb1@test.com',
      password: 'password123'
    });
    const tokenB = loginB.data.token;
    console.log('User B logged in.');

    const spendingB = await axios.get(`${API_URL}/budgets/spending`, {
       headers: { Authorization: `Bearer ${tokenB}` }
    });
    console.log('User B spending profile:', spendingB.data);

    if (Object.keys(spendingB.data).length === 0) {
      console.log('\nSUCCESS! User B does not see User A spending amounts.');
    } else {
      console.log('\nFAILURE! User B sees data they should not.');
    }

  } catch (err) {
    console.error('Verification failed:', err.message);
  }
}

verify();
