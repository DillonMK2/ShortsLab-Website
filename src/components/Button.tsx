import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'

type BaseProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  className?: string
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: never
  }

type ButtonAsAnchor = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string
  }

type ButtonProps = ButtonAsButton | ButtonAsAnchor

export default function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    glow = false,
    className = '',
    ...restProps
  } = props

  const baseStyles = `
    inline-flex items-center justify-center
    font-medium
    rounded-xl
    transition-all duration-300 ease-out
    cursor-pointer
    relative
    overflow-hidden
  `

  const variants = {
    primary: `
      bg-white/5 backdrop-blur-sm
      border border-white/10
      text-white
      hover:bg-white/10 hover:border-white/20
      hover:scale-[1.02]
      active:scale-[0.98]
    `,
    secondary: `
      bg-transparent
      border border-white/10
      text-white/80
      hover:bg-white/5 hover:text-white hover:border-white/20
      hover:scale-[1.02]
      active:scale-[0.98]
    `,
    gradient: `
      bg-gradient-to-r from-accent-violet to-accent-cyan
      text-white font-semibold
      hover:opacity-90 hover:scale-[1.02]
      active:scale-[0.98]
      shadow-glow-gradient
    `,
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const glowStyles = glow ? 'glow-gradient-animated' : ''

  const classes = `group ${baseStyles} ${variants[variant]} ${sizes[size]} ${glowStyles} ${className}`

  const content = (
    <>
      {variant === 'gradient' && (
        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  )

  if ('href' in props && props.href) {
    const { href, ...anchorProps } = restProps as Omit<ButtonAsAnchor, keyof BaseProps>
    return (
      <a href={props.href} className={classes} {...anchorProps}>
        {content}
      </a>
    )
  }

  const buttonProps = restProps as Omit<ButtonAsButton, keyof BaseProps>
  return (
    <button className={classes} {...buttonProps}>
      {content}
    </button>
  )
}
