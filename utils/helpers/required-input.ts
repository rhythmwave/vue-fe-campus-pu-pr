export { ErrorEmailRequire, ErrorInputRequire };

function ErrorEmailRequire(email: string) :boolean {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return false
    } else {
      return true
    }
}

function ErrorInputRequire(input: string) :boolean {
    if (input != '') {
      return false
    } else {
      return true
    }
}