
import * as React from 'react'
import {
  infoSection,
  sectionHeader,
  sectionSpacer,
  sectionBody,
} from './infoSection.pcss'

export interface InfoSectionProps {
  title: string
  spacerColor: string
  children: React.ReactNode
}

export function InfoSection ({ title, spacerColor, children }: InfoSectionProps) {
  return (
    <div className={infoSection}>
      <h2 className={sectionHeader}>
         {title}
      </h2>
      <div className={sectionSpacer} style={{ background: spacerColor }} />
      <div className={sectionBody}>
        {children}
      </div>
    </div>
  )
}
