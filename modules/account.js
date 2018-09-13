const util = require('../utils/util.js')

var __accounts = []
const Accounts = class {

    constructor(data) {
        __accounts = data || []
    }

    get(date) {
        if (!date || !util.isObject(date)) return __accounts

        var ac = __accounts.find(e => {
            return e.year === date.year &&
                e.month === date.month &&
                e.day === date.day
        })

        return ac
    }

    addOrUpdate(date, account) {
        var time = date || util.today()
        var haveAccount = this.get(time)
        var ac = {}
        ac.year = time.year
        ac.month = time.month
        ac.day = time.day
        ac.total = account.total
        ac.details = haveAccount.details
        if (haveAccount) {
            __accounts.splice(__accounts.indexOf(haveAccount), 1, ac)
        } else {
            __accounts.push(ac)
        }
    }

    remove(oneDayAccount) {
        if (this.get(oneDayAccount)) {
            return __accounts.splice(__accounts.indexOf(oneDayAccount), 1)
        } else {
            return undefined
        }
    }
}

/**
 *  
 * @param {Object} options 
 */
const Account = class {
    constructor(name, amount) {
        var n = util.toNumber(amount)
        if (amount > 0) {
            this.income = {
                name: name,
                amount: n
            }
        } else if (amount < 0) {
            this.expenses = {
                name: name,
                amount: Math.abs(n)
            }
        }
    }
}

module.exports = {
    Accounts: Accounts,
    Account: Account
}
