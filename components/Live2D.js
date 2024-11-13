/* eslint-disable no-undef */
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isMobile, loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * 网页动画
 * @returns
 */
export default function Live2D() {
  const { theme, switchTheme } = useGlobal()
  const showPet = JSON.parse(siteConfig('WIDGET_PET'))
  const petLink = siteConfig('WIDGET_PET_LINK')

useEffect(() => {
  if (showPet && !isMobile()) { // 确保移动端不加载模型
    Promise.all([
      loadExternalResource('https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d.min.js', 'js')
    ]).then((e) => {
      if (typeof window?.loadlive2d !== 'undefined') {
        try {
          loadlive2d('live2d', petLink)
        } catch (error) {
          console.error('读取PET模型', error)
        }
      }
    })
  }
}, [theme])

  function handleClick() {
    if (JSON.parse(siteConfig('WIDGET_PET_SWITCH_THEME'))) {
      switchTheme()
    }
  }

  if (!showPet) {
    return <></>
  }

  return <canvas id="live2d" width="280" height="500" onClick={handleClick}
        className="cursor-grab"
        onMouseDown={(e) => e.target.classList.add('cursor-grabbing')}
        onMouseUp={(e) => e.target.classList.remove('cursor-grabbing')}
    />
}
