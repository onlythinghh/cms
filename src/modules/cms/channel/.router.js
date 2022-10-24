import Channel from './channelList/'
import ChannelRecycle from './channelRecycle/'
export default {
    path: 'channel',
    name: 'channel',
    meta: { title: '频道管理' },
    component: {
        render: h => h('router-view')
    },
    children: [
        {
            path: 'channel-list',
            name: 'channelList',
            meta: { title: '频道维护' },
            component: Channel
        },
        {
            path: 'channel-recycle',
            name: 'channelRecycle',
            meta: { title: '频道回收站' },
            component: ChannelRecycle
        }
    ]
}
