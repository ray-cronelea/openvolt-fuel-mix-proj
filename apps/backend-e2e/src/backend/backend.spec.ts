import axios from 'axios';

describe('GET /api', () => {
  it('should return a message', async () => {
    const res = await axios.get(`api`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'This value came from a library!' });
  });
})

describe('GET /api/energy-consumed', () => {
  it('should return an energy consumed response', async () => {
    const res = await axios.get(`api/energy-consumed?reqDate=2023-02-01T00:00:00.000Z`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ energyConsumed: '91122.30' });
  }, 60000);
})

describe('GET /api/carbon-emitted', () => {
  it('should return a carbon emitted response', async () => {
    const res = await axios.get(`api/carbon-emitted?reqDate=2023-02-01T00:00:00.000Z`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ carbonEmit: 15283733.099999992 });
  }, 60000);
})
