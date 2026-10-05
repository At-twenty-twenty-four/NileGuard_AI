export async function graphqlQuery(query: string, variables?: Record<string, any>) {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL error: ${response.statusText}`)
  }

  const result = await response.json()

  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL error')
  }

  return result.data
}

// Pre-defined queries
export const queries = {
  getThreats: `
    query {
      threats {
        id
        title
        severity
        type
        status
        createdAt
      }
    }
  `,
  getCompliance: `
    query {
      compliance {
        id
        framework
        controlId
        controlName
        status
        percentage
      }
    }
  `,
  getAuditLogs: `
    query {
      auditLogs {
        id
        action
        resource
        status
        createdAt
      }
    }
  `,
}

export async function getThreats() {
  return graphqlQuery(queries.getThreats)
}

export async function getCompliance() {
  return graphqlQuery(queries.getCompliance)
}

export async function getAuditLogs() {
  return graphqlQuery(queries.getAuditLogs)
}
