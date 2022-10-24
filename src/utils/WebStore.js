import JsCookie from 'js-cookie'
class DB {
    constructor (db) {
        this.db = db
    }
    db = null
    set (key, value, toJSON = true) {
        this.db.setItem(key, toJSON ? JSON.stringify(value) : value)
    }
    get (key, isJSONParse = true) {
        try {
            return isJSONParse ? JSON.parse(this.db.getItem(key)) : this.db.getItem(key)
        } catch (error) {
            return null
        }
    }
    clear (key) {
        key ? this.db.removeItem(key) : this.db.clear()
    }
}

class Session extends DB {

}

class Local extends DB {

}

export const cookie = JsCookie

export const session = new Session(sessionStorage)

export const local = new Local(localStorage)
