

const List = []
const count = 20



export default {
  getList: () => {
    return {
      total: List.length,
      items: List
    }
  }
}
