export function Loader() {
    return (
        <div className="grid place-content-center place-items-center h-full">
            <div className="flex w-full flex-col items-center justify-center gap-4">
                <div className="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-primary text-4xl text-primary">
                    <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-secondary text-2xl text-secondary">
                        <div className="flex h-8 w-8 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-accent text-xl text-accent"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}