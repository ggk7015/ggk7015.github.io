export type SectionLink = {
  id: string
  label: string
  code: string
  hint: string
}

/**
 * The four destinations of the star map. Kept in one place so the header
 * constellation, the orbital map and the active-section observer cannot drift.
 */
export const SECTIONS: readonly SectionLink[] = [
  { id: 'work', label: '作品', code: '01', hint: '正在建造的東西' },
  { id: 'trajectory', label: '經歷', code: '02', hint: '走過的路徑' },
  { id: 'capabilities', label: '能力', code: '03', hint: '可以交付的技能' },
  { id: 'signal', label: '聯絡', code: '04', hint: '發出訊號' },
]

export const SECTION_IDS = SECTIONS.map((section) => section.id)
