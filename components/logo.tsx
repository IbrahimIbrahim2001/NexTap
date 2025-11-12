import { SVGProps } from "react"
export const Logo = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <rect width={80} height={80} rx={18} fill="oklch(0.6255 0.1866 259.6901)" />
            <rect
                x={20}
                y={16}
                width={40}
                height={48}
                rx={4}
                fill="white"
                opacity={0.95}
            />
            <line
                x1={26}
                y1={24}
                x2={48}
                y2={24}
                stroke="oklch(0.6255 0.1866 259.6901)"
                strokeWidth={2}
                strokeLinecap="round"
            />
            <line
                x1={26}
                y1={32}
                x2={54}
                y2={32}
                stroke="oklch(0.6255 0.1866 259.6901)"
                strokeWidth={2}
                strokeLinecap="round"
            />
            <line
                x1={26}
                y1={40}
                x2={50}
                y2={40}
                stroke="oklch(0.6255 0.1866 259.6901)"
                strokeWidth={2}
                strokeLinecap="round"
            />
            <circle cx={24} cy={56} r={6} fill="oklch(0.85 0.15 259)" />
            <circle cx={40} cy={56} r={6} fill="oklch(0.85 0.15 259)" />
            <circle cx={56} cy={56} r={6} fill="oklch(0.85 0.15 259)" />
            <line
                x1={24}
                y1={56}
                x2={40}
                y2={56}
                stroke="oklch(0.85 0.15 259)"
                strokeWidth={2}
            />
            <line
                x1={40}
                y1={56}
                x2={56}
                y2={56}
                stroke="oklch(0.85 0.15 259)"
                strokeWidth={2}
            />
        </svg>
    )
};
