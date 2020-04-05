module.exports = (err, logChannel) => {
  console.log(err);
  logChannel.send(err.message);
};
