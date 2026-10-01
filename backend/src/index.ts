import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // 1. Automatically enable Public permissions for article, category, author
    try {
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (publicRole) {
        const apis = ['article', 'category', 'author'];
        const actions = ['find', 'findOne'];

        for (const api of apis) {
          for (const action of actions) {
            const actionId = `api::${api}.${api}.${action}`;
            const existingPermission = await strapi
              .query('plugin::users-permissions.permission')
              .findOne({
                where: {
                  action: actionId,
                  role: publicRole.id,
                },
              });

            if (!existingPermission) {
              await strapi.query('plugin::users-permissions.permission').create({
                data: {
                  action: actionId,
                  role: publicRole.id,
                  enabled: true,
                },
              });
            }
          }
        }
      }
    } catch (err) {
      console.warn('Could not auto-configure public permissions:', err);
    }
  },
};
