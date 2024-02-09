#!/usr/bin/perl
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
my $db_pass   = '753159';
my $db_host   = 'localhost';
my $table     = 'users';
sub generar_token_sesion {
    my $tiempo_actual = time();
    my $token = sha1_hex($tiempo_actual, rand());
    return $token;
}
my $cgi = CGI->new;
my $password = $cgi->param('password');
my $email  = $cgi->param('email');
my $dbh = DBI->connect("DBI:mysql:database=$db_name;host=$db_host", $db_user, $db_pass);
my $query = "SELECT * FROM $table WHERE email = ? AND password = ?";
my $sth = $dbh->prepare($query);
$sth->execute($email, $password);
if (my $usuario = $sth->fetchrow_hashref) {
    my $token_sesion = generar_token_sesion();
    my $submitToken = "UPDATE $table SET token_sesion = ? WHERE email = ?";
    my $stm = $dbh->prepare($submitToken);
    $stm->execute($token_sesion, $email);
    my $cookie = CGI::Cookie->new(
        -name    => 'token_sesion',
        -value   => $token_sesion,
        -expires => '+1d',
    );
    print $cgi->header(-cookie => $cookie, -type => 'application/json');
    print encode_json($usuario);
}else{
    print $cgi->header(-type => 'application/json', -status => '500 Internal Server Error');
    print '{"success" : "Hubo Un Error al realizar la peticion"}';
}
