local redis = require "resty.redis"
local config = require "lua.config"

local r = redis:new()
r:set_timeout(2000)

local ok, err = r:connect(config.redis_host, config.redis_port)
if not ok then
    ngx.status = 500
    ngx.say("redis cannot connect: ", err)
    return
end

local m = ngx.re.match(ngx.var.host, [[^([^.]+)\.]], "jo")
local host = m[1]

ngx.var.target = host .. ':10000'

proxy, err = r:get('gateway:' .. host)
if err then
    return
end

if not proxy then
    return
end

if proxy == ngx.null then
    return
end
r:set_keepalive(10000, 100)
ngx.var.target = proxy
