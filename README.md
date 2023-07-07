
# MOTU UltraLite mk5 WebSockets bridge

_Now with autoconfig!_

This bridge application can be run on a computer connected to MOTU UltraLite mk2 audio interface to relay WebSockets messages bidirectionally between a remote/mobile CueMix 5 app (e.g. on an iPad or iPhone) and the UltraLite. It allows you to control your UltraLite wirelessly/remotely.

## What is this repo for, then?

The node.js app in this repo is still useful if you are using Linux (e.g. on a Raspberry Pi) on your computer. MOTU's CueMix 5 and drivers do not work on Linux, so this is a great way to have (wireless!) mixer control of your UltraLite.

## Instructions

1. `cd` into the `node` folder
2. Install the `ws` dependency: `npm install`
3. Run the node app on the computer where the UltraLite is connected: `node index.js`
4. Run the CueMix 5 app from an iPad/iPhone/Computer that's on the same LAN
5. On the welcome screen, tap/click on `IP Connect`. Replace the IP with the computer's hostname (`computer-name.local`) or IP address (`192.168.x.x`)

If everything is set up correctly, your mobile app should connected to your UltraLite through your computer.

## Autoconfig

The `UltraLite-mk5` announces it's presence on the ethernet interface it creates by sending a `UDP` packet to the broadcast address (`255.255.255.255`). Conveniently, it's in JSON \^o^/

```json
{
    "uid":"000000000000dead", // scrubbed for documentation
    "name":"UltraLite-mk5",
    "ip":"169.254.41.114",
    "model":"UltraLite-mk5",
    "version":"1.2.0+2467",
    "interval":1
}
```

Knowing this, we just listen for `UDP` packets until we recieve the correct one and parse the IP. _Have only tested the autoconfig functionality on Windows so far..._
