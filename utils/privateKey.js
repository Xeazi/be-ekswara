const privateKey = `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgH02K3iJHfUs5ImgCDB5e6sIAo4O
dpgy8qSh/O/SBRd89P75RvcPbM4x3KjPug/LVFlSRTJuoVHJOKFIXMIWou7PmTVQ
NzXdpHyL1WGWuoS44Poq2nYte/g7ZrYx8xHkZtJgLhWqfHINUX2CJDhwbaErX0ir
g7dM/RKvC24EUEMTAgMBAAE=
-----END PUBLIC KEY-----`

const buff = Buffer.from(privateKey).toString("base64");

module.exports = buff;