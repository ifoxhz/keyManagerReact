import styled from 'styled-components'
import { Layout, Drawer } from 'antd'
const { Sider, Content, Header } = Layout

export const AsideWrap = styled(Sider)`
  &.ant-layout-sider {
    position: fixed;
    left: 0;
    height: 100vh;
  }
`

export const ContentWrap = styled(Layout)`
  &.ant-layout {
    margin-left: 208px;
    min-height: 100vh;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .fade-appear,
  .fade-enter {
    transform: translateX(18px);
    opacity: 0;
  }

  .fade-appear-active,
  .fade-enter-active {
    transition: all 0.3s ease-out;
    transform: translateX(0);
    opacity: 1;
  }

  .fade-exit {
    transition: all 0.3s ease-out;
    transform: translateX(0);
    opacity: 1;
  }

  .fade-exit-active {
    transform: translateX(18px);
    opacity: 0;
  }
`

export const HeaderWrap = styled.div`
  position: fixed;
  right: 0;
  left: 208px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 10;
`

export const HeaderContent = styled(Header)`
  &.ant-layout-header {
    padding: 0 24px;
    height: 48px;
    display: flex;
    align-items: center;
    background: #ffffff;
    z-index: 1;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  }
  .ant-breadcrumb {
    margin-bottom: 0 !important;
    margin-left: 40px;
  }
`

export const Main = styled(Content)`
  position: relative;
  margin-top: 84px;
  padding: 24px 24px 24px;
  overflow-x: hidden;
`

export const LogoWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  transition: width 0.3s ease-out;
  span {
    margin-left: 10px;
    font-size: 20px;
    color: #fff;
  }
`

export const CollapsedWrap = styled.div``

export const GithubWrap = styled.a.attrs((props) => ({
  href: 'https://www.KMS.com'
}))`
  margin-left: auto;
  color: #000;
`

export const DrawerWrap = styled(Drawer)`
  .ant-drawer-body {
    padding: 0;
  }
`

export const Footer = styled.footer`
  margin-top: 24px;
  text-align: center;
`
