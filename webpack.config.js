const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "production",

    entry: {
        main: './src/main.tsx'
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 5000,
        historyApiFallback: {
            index: 'index.html'
        }
    },

    plugins: [
        //new CleanWebpackPlugin({ root: __dirname }),
        new HtmlWebpackPlugin({
            //base: { href: 'http://localhost:5000/dist' },
            filename: 'index.html',
            template: 'src/index.html',
            inject: 'body'
        }), new CopyWebpackPlugin([
            { from: 'node_modules/react/umd/react.development.js', to: './libs/react/react.development.js' },
            { from: 'node_modules/react-dom/umd/react-dom.development.js', to: './libs/react-dom/react-dom.development.js' },
            { from: 'node_modules/react-router-dom/umd/react-router-dom.js', to: './libs/react-router-dom/react-router-dom.js' },
            { from: 'static/trucktimeline.json', to: 'trucktimeline.json' }
        ])
    ],

    output: {
        filename: '[name].js',
        library: '[name]',
        path: path.resolve(__dirname, 'dist')
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        'react-router-dom': 'ReactRouterDOM'
    }
};