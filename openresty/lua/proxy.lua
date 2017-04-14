local redis = require "resty.redis"
local config = require "lua.config"
local r = redis:new()
r:set_timeout(1000)

local ok, err = r:connect(config.redis_host, config.redis_port)
if not ok then
    ngx.status = 500
    ngx.say("redis not found", err)
    return
end

proxy, err = r:get(ngx.var.host)
if not proxy then
    ngx.status = 500
    ngx.say("failed to get", err)
    return
end

if proxy == ngx.null then
    ngx.status = 404
    ngx.say(ngx.var.host .. "not found")
    return
end
r:set_keepalive(10000, 100)
ngx.var.target = proxy
