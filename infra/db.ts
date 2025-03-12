
export const auroraDBvpc = new sst.aws.Vpc("EvalyDBVPC",{
});

export const auroraDB = new sst.aws.Aurora("EvalyDB", {
  engine: "postgres",
  scaling: {
    min: "0.5 ACU",
    max: "1 ACU",
  },
  vpc: auroraDBvpc,
  dev: {
    database: "postgres",
    host: "127.0.0.1",
    password: "",
    port: 5432,
    username: "postgres",
  }
})
