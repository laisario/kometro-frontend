import { Helmet } from 'react-helmet-async';
import { Grid, Container, CircularProgress } from '@mui/material';
import { 
  AppOrderTimeline, 
  AppWidgetSummary, 
  AppListItems
 } from '../components';
import { fDate } from '../../utils/formatTime';
import { useDashboardVM } from '../viewModels/useDashboardVM';


export default function DashboardPage() {
  const {
    data,
    instruments,
    user,
    documents
  } = useDashboardVM()
  return (
    <>
      <Helmet>
        <title>Kometro</title>
      </Helmet>

      <Container maxWidth="xl">
        {!data ? (
          <Grid container item height="70vh" justifyContent="center" alignItems="center" spacing={3}>
            <CircularProgress size="96px" />
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Instrumentos vencidos"
                color="error"
                total={data?.instrumentosVencidos || 0}
                icon={'ant-design:close-outlined'}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Instrumentos calibrados em dia"
                color="success"
                total={data?.instrumentosEmDia || 0}
                icon={'ant-design:check-outlined'}
              />
            </Grid>

            {user?.admin
              ? (<Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary
                  title="Documentos vencidos"
                  total={data?.documentosVencidos || 0}
                  color="info"
                  icon={'mdi:file-document-alert-outline'}
                />
              </Grid>)
              : (<Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary
                  title="Instrumentos cadastrados"
                  total={data?.instrumentosCadastrados || 0}
                  color="info"
                  icon={'fluent-mdl2:total'}
                />
              </Grid>
              )}

            {user?.admin ? (
              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary
                  title="Propostas em elaboração"
                  total={data?.propostasEmElaboracao || 0}
                  color="warning"
                  icon={'ant-design:file-sync-outlined'}
                />
              </Grid>
            ) : (
              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary
                  title="Propostas aguardando aprovação"
                  total={data?.propostasAguardandoAprovacao || 0}
                  color="warning"
                  icon={'ant-design:file-sync-outlined'}
                />
              </Grid>
            )}

            <Grid item xs={12} md={7} lg={8}>
              <AppListItems
                title={user?.admin ? "Revisões a serem aprovadas" : "Instrumentos recentes"}
                list={user?.admin ? documents : instruments}
                document={user?.admin}
              />
            </Grid>

            <Grid item xs={12} md={5} lg={4}>
              <AppOrderTimeline
                title="Propostas recentes"
                list={data?.ultimasPropostas?.map((proposta) => ({
                  id: proposta?.id,
                  title: `Proposta ${proposta?.numero}`,
                  status: proposta?.status,
                  time: fDate(proposta?.dataCriacao),
                  url: user?.admin ? `/admin/proposta/${proposta?.id}/${proposta?.cliente?.id}` : `/dashboard/proposta/${proposta?.id}`,
                  client: proposta?.cliente?.empresa?.razaoSocial || proposta?.cliente?.nome,
                }))}
              />
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
}
