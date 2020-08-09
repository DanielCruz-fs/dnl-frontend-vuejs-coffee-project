import axios from 'axios';
import { IState } from '@/types/vuex/State';
import { IInventoryTimeLine } from '@/types/InventoryGraph';

const API_URL: string  =  process.env.VUE_APP_API_URL;

const state: IState = {
  snapshotTimeLine: {
    productInventorySnapshot: []
  },
  isTimelineBuilt: false
};

const mutations = {
  'SET_SNAPSHOT_TIMELINE': (state: IState, data: IInventoryTimeLine ) => state.snapshotTimeLine.productInventorySnapshot = data,
  'SET_IS_TIMELINE_BUILT': (state: IState, data: boolean) => state.isTimelineBuilt = data
};

const actions = {
  /** Assing a TYPE to a DESTRUCTURED PROPERTY typescript, otherwise throws an error */
  async assignSnapshots({commit}: {commit: any}) {
    const response = await axios.get(`${API_URL}/inventory/snapshot`);
    // let timeline: IInventoryTimeLine = {
    //   productInventorySnapshot: response.data.productInventorySnapshots,
    //   timeline: response.data.timeLine
    // };
    
    console.log(response.data);
    commit('SET_SNAPSHOT_TIMELINE', response.data);
    commit('SET_IS_TIMELINE_BUILT', true);
  }
};

const getters = { };

export default {
  state,
  getters,
  actions,
  mutations
};