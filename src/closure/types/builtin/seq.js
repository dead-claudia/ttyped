export default function seq(list) {
    let ret = ""
    for (let i = 0; i < list.length; i++) {
        ret += `, ${list[i]}`
    }
    return ret.slice(2)
}
