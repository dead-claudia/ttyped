function isName(name) {
    return typeof name === "string" && name !== ""
}

export default function getName(func) {
    if (isName(func.name)) return func.name
    if (isName(func.displayName)) return func.displayName
    return "<anonymous>"
}
