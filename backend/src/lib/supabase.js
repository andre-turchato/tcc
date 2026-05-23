'use strict';

const { createClient } = require('@supabase/supabase-js');
const env = require('../config/env');

/**
 * Instância única do cliente Supabase.
 * Utiliza a Service Role Key para permitir leitura direta na tabela `internacoes`.
 */
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

module.exports = supabase;
