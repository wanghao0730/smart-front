//在这个indexjs文件中导入vue文件的默认导出 并且进行重命名
//外界使用 import { NavBar,AppMain } from '@/layout/components' 绝对路径或者相对路径访问
export { default as AppMain } from './AppMain'
export { default as Navbar } from './Navbar'
export { default as Settings } from './Settings'
export { default as Sidebar } from './Sidebar/index.vue'
export { default as TagsView } from './TagsView/index.vue'
