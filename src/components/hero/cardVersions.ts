export type CardFaceContent = {
  eyebrow?: string
  headline?: string
  subhead?: string
  strip?: string
  body: string
  chips?: string[]
  footerNote?: string
  layout?: 'default' | 'logo-statement' | 'contact'
  email?: string
  linkedin?: string
}

export type CardCopy = {
  front: CardFaceContent
  back: CardFaceContent
}

/** Single active card — former Version 8 */
export const CARD_COPY: CardCopy = {
  front: {
    layout: 'logo-statement',
    body: 'Built to Work. Built to Scale. Built With You.',
  },
  back: {
    layout: 'contact',
    headline: 'Jean Pierre Georges',
    subhead:
      'Full-Stack Developer • Tech Lead • Digital Solutions Architect • Technical Project Manager',
    body: '',
    email: 'jeanpierregrgs@gmail.com',
    linkedin: 'https://www.linkedin.com/in/jean-pierre-georges',
  },
}
