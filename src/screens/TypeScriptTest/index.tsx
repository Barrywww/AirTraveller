import * as React from 'react'

type AppProps = {
    message: string
}

const TsTestPage: React.FC<AppProps> = (props: AppProps) => {
    return <h1>Hello {props.message}</h1>
}

export default TsTestPage
