import request from 'request-promise-native';

const LOYALTY_PROGRAM_ID = '2818533577102730664';
const SYMBOL = 'ASP';
const TOKEN = process.env.LUNIVERSE_TOKEN;

export default class LuniverseService {
  
  async getUserBalance(userId) {
    const reply = await request(`https://api.luniverse.io/svc/v2/mercury/point-accounts/${encodeURIComponent(`${userId}`)}/balances/${SYMBOL}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      json: true
    });
    const {
      pointAccountId,
      balance,
      address,
      createdAt,
      status,
    } = reply.data.balance;
    return {
      pointAccountId,
      balance: Number(balance),
      address,
      createdAt: new Date(createdAt),
      status,
    };
  }

  async addUserPointHistory(userId, orderId, amount, description, expiresIn = 315360000) {
    const reply = await request.post('https://api.luniverse.io/svc/v2/mercury/point/save', {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      body: {
        orderIdentifier: `${orderId}`,
        userIdentifier: `${userId}`,
        loyaltyProgramId: LOYALTY_PROGRAM_ID,
        amount: `${amount}`,
        expiresIn,
        description,
      },
      json: true
    });
    const {
      pointHistoryId,
      orderIdentifier,
      userIdentifier,
      type,
      action,
      createdAt,
    } = reply.data.pointHistory;
    return {
      pointHistoryId,
      orderIdentifier,
      userIdentifier,
      type,
      action,
      amount: Number(amount),
      createdAt: new Date(createdAt),
    }
  }

  async cancelUserPointHistory(orderId, amount, description) {
    request.delete('https://api.luniverse.io/svc/v2/mercury/point/saving/cancel', {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      body: {
        originalOrderIdentifier: `${orderId}`,
        orderIdentifier: `${orderId}.rollback`,
        loyaltyProgramId: LOYALTY_PROGRAM_ID,
        amount: `${amount}`,
        description,
      },
      json: true
    });
  }

  async getUserPointHistories(userId, offset = 0, limit = 50) {
    const page = Math.round(offset / limit) + 1;
    const rpp = limit;

    const reply = await request('https://api.luniverse.io/svc/v2/mercury/point/histories', {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      qs: {
        userIdentifier: `${userId}`,
        loyaltyProgramId: LOYALTY_PROGRAM_ID,
        page, rpp,
      },
      json: true
    });
    const items = reply.data.pointHistories.items;
    return items.map(({
      pointHistoryId,
      orderIdentifier,
      userIdentifier,
      type,
      action,
      amount,
      description,
      createdAt,
    }) => {
      return {
        pointHistoryId,
        orderIdentifier,
        userIdentifier,
        type,
        action,
        amount: Number(amount),
        description,
        createdAt: new Date(createdAt),
      }
    });
  }

}