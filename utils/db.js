const mongoose = require("mongoose")

const db_connect =async ()=>{
    try {
        const mode = process.env.NODE_ENV || process.env.mode || "development"
        const isProduction = mode === "production"
        const productionDbUrl = process.env.DB_LOCAL_URL || process.env.DB_PROD_URL
        const localDbUrl = process.env.DB_LOCAL_URL || process.env.DB_LOCAL_URL
        const dbUrl = isProduction ? productionDbUrl : localDbUrl
        if (!dbUrl) {
            throw new Error(`Database URL is missing for mode: ${mode}`)
        }
        await mongoose.connect(dbUrl)
        console.log(`${isProduction ? "production" : "local"} database connected`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


module.exports = db_connect