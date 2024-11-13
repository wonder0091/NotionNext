/* eslint-disable no-undef */
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isMobile, loadExternalResource } from '@/lib/utils'
import { useEffect, useState } from 'react'

/**
 * 网页动画
 * @returns
 */
export default function Live2D() {
  const { theme, switchTheme } = useGlobal()
  const showPet = JSON.parse(siteConfig('WIDGET_PET'))
  const petLink = siteConfig('WIDGET_PET_LINK')
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const isSmallScreen = windowWidth < 768;

    if (showPet && !isMobile() && !isSmallScreen) {
      Promise.all([
        loadExternalResource(
          'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d.min.js',
          'js'
        )
      ]).then(() => { //  这里可以简化，不需要e参数
        if (typeof window?.loadlive2d !== 'undefined') {
          try {
            loadlive2d('live2d', petLink)
          } catch (error) {
            console.error('读取PET模型', error)
          }
        }
      })
    } else if (typeof window?.loadlive2d !== 'undefined' && (isMobile() || isSmallScreen)) {
        // 如果条件不满足，并且 loadlive2d 已经加载，则尝试移除模型
        const live2dCanvas = document.getElementById('live2d');
        if (live2dCanvas) {
            live2dCanvas.remove(); // 直接移除canvas元素
        }

    }
  }, [theme, windowWidth, showPet]) // 添加 windowWidth 和 showPet 到依赖数组


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
