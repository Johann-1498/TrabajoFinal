#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use strict;
use warnings;
use CGI;
use CGI::Cookie;
use DBI;
use JSON;
use Digest::SHA qw(sha1_hex);
my $db_name   = 'trabajofinal';
my $db_user   = 'root';
my $db_pass   = '';
my $db_host   = 'localhost';
my $table     = 'users';
sub generar_token_sesion {
    my $tiempo_actual = time();
    my $token = sha1_hex($tiempo_actual, rand());
    return $token;
}
my $cgi = CGI->new;
my $password = $cgi->param('password') // '';
my $email  = $cgi->param('email') // '';
my $dbh = DBI->connect("DBI:mysql:database=$db_name;host=$db_host", $db_user, $db_pass)
  or die "No se pudo conectar a la base de datos: $DBI::errstr";

my $query = "SELECT * FROM $table WHERE email = ? AND password = ?";
my $sth = $dbh->prepare($query);
$sth->execute($email, $password) or die "Error en la ejecución de la consulta: $DBI::errstr";

if (my $usuario = $sth->fetchrow_hashref) {
    my $token_sesion = generar_token_sesion();
    my $submitToken = "UPDATE $table SET token_sesion = ? WHERE email = ?";
    my $stm = $dbh->prepare($submitToken);
    $stm->execute($token_sesion, $email) or die "Error en la consulta";

    my $cookie = CGI::Cookie->new(
        -name    => 'token_sesion',
        -value   => $token_sesion,
        -expires => '+1d',
    );
    print $cgi->header(-cookie => $cookie, -type => 'application/json');
    print '{"success": true}';
} else {
    print $cgi->header(-type => 'application/json');
    print '{"success": false}';
}