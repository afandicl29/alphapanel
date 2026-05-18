import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SecurityService } from './security.service';

@ApiTags('Security')
@ApiBearerAuth()
@Controller('security')
export class SecurityController {
  constructor(private security: SecurityService) {}

  @Get('firewall')
  firewall() {
    return this.security.firewallRules();
  }

  @Post('firewall')
  addFirewall(@Body() body: { name: string; port: number; protocol?: string; action?: string; sourceIp?: string }) {
    return this.security.addFirewallRule(body);
  }

  @Get('blocked-ips')
  blockedIps() {
    return this.security.blockedIps();
  }

  @Post('blocked-ips')
  blockIp(@Body() body: { ipAddress: string; reason?: string }) {
    return this.security.blockIp(body.ipAddress, body.reason);
  }

  @Get('fail2ban')
  fail2ban() {
    return this.security.fail2banJails();
  }

  @Get('login-history')
  loginHistory(@Query('userId') userId?: string) {
    return this.security.loginHistory(userId);
  }
}
