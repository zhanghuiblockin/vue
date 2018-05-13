import axios from 'axios'

const BASE_URL = 'http://ltc-bj-dev.c6396418dd7954b228d8b967c8a929103.cn-beijing.alicontainer.com/api/public/v1'

export const API = {
  // 不需认证
  /**
   * [getBlocks 获取矿池出块数据]
   * @Author   Zhanghui
   * @DateTime 2017-12-08
   * @param    {[type]}   coinType  [description:order_by/page_size]
   * @return   {[type]}             [description]
   */
  getBlocks (coinType) {
    return axios(`${BASE_URL}/pool/blocks/merge?coin_type=${coinType}`)
  }
}
