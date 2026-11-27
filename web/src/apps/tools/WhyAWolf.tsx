import type { ToolProps } from '../../types'
import { BrandMark } from '../../ui/BrandMark'
import { TextFile } from '../../ui/TextFile'
import styles from './WhyAWolf.module.css'

export function WhyAWolf(_props: ToolProps) {
  return (
    <TextFile aside={<BrandMark className={styles.wolf} size={88} strokeWidth={1.6} />}>
      <p>
        <strong>Why a wolf?</strong>
        <span className={styles.aside}>(yes, it’s supposed to be one)</span>
      </p>
      <p>
        The wolf was here before the tools. My surname, Lobato, means wolf cub in Spanish, and as a
        kid I was a cub scout, so I’ve been a small wolf for a while now.
      </p>
      <p>
        When I started building things to share, I wanted a place where people could open them and
        try, not just read about them on a CV. Lobato plus tools became lobatools, and the wolf came
        along.
      </p>
    </TextFile>
  )
}
