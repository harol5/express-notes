const whiteList = ["http://127.0.0.1:9000", "http://localhost:9000"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) callback(null, true);
    else callback(new Error("not allowed by CORS"));
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
