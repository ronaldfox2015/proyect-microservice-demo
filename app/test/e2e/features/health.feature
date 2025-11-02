Feature: Gestión de healths
  Como cliente del API
  Quiero poder realizar operaciones GET sobre healths
  Para verificar que el endpoint funcione correctamente

  Scenario: Obtener lista de healths
    Given la aplicación está inicializada
    When envío una solicitud GET a "/v2/demo/health"
    Then debería recibir un código de estado 200
