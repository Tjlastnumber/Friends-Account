const util = require('../utils/util.js')

var __accounts = []
const AccountCollection = class {

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

    /**
     * Add or Update Account
     * @param {Object} date 
     * @param {Account} account 
     */
    addOrUpdate(date, account) {
        var time = date || util.today()
        var haveAccount = this.get(time)
        var ac = {}
        ac.year = time.year || util.today().year
        ac.month = time.month || util.today().month
        ac.day = time.day || util.today().day
        ac.account = account
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
    constructor() {
        var n = util.toNumber(amount)
        this.details = Object.create(null)
    }

    get(key) {
        return this.details[key]
    }

    add(name, amount) {
        const date = new Date()
        const key = date.toISOString()
        if (amount == 0) return
        _setDetials(this.details, key, name, amount)
    }

    update(key, name, amount) {
        _setDetials(this.details, key, name, amount)
    }

    delete(key) {
        delete this.details[key]
    }
}

function _setDetials(details, key, name, amount) {
    let n = util.toNumber(amount)
    details[key] = {
        amount: Math.abs(amount),
        name: name,
        type: n > 0 ? 1 : n < 0 ? -1 : 0,
        date: date
    }
}

module.exports = {
    Accounts: AccountCollection,
    Account: Account
}
