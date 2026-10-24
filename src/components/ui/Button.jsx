export default function Button({ children, className = 'dash-primary', ...props }) { return <button className={className} {...props}>{children}</button> }
