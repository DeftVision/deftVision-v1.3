module.exports = {
  apps: [
    {
      name: "backend",
      script: "npm",
      args: "start:beta",
      cwd: "/home/ec2-user/deftVision-v1.3/backend",
      interpreter: "/bin/bash",
      env: {
        NODE_ENV: "beta",
      },
    },
  ],
};
