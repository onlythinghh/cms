import Article from './index'
import ArticleList from './articleList'
import ArticleRecycle from './articleRecycle/'
export default [
    {
        path: 'article',
        name: 'article',
        meta: { title: '文章管理' },
        component: Article,
        children: [
            {
                path: 'article-list',
                name: 'articleList',
                meta: { title: '文章维护' },
                component: ArticleList
            }/* ,
            {
                path: 'article-recycle',
                name: 'articleRecycle',
                meta: { title: '文章回收站' },
                component: ArticleRecycle
            } */
        ]
    },
    {
        path: 'article/article-recycle',
        name: 'articleRecycle',
        meta: { title: '文章回收站' },
        component: ArticleRecycle
    }
]
