# Vercel Request-Protection Audit

**Scope:** Read-only Vercel dashboard inspection. No firewall, bot, hosting, domain, or deployment setting was changed.

| Finding | Observed state |
| --- | --- |
| Firewall | Active |
| System mitigations | Active |
| Custom firewall rules | 0 |
| Project-rule actions exposed by Vercel | Log, deny, challenge, bypass, and rate limit traffic |
| Bot protection | Inactive |

Vercel exposes a platform-level rate-limiting rule action that can be applied to route patterns without introducing application storage. The project currently has no custom rule. Any rate-limit rule creation is a persistent production configuration change and remains outside the scope of the completed read-only inspection; it requires the user’s explicit confirmation before it is added.
